import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createPatchedFetch } from "../_core/patchedFetch";
import { ENV } from "../_core/env";
import {
  withRetry,
  validateTranscript,
  validateQuestion,
  withTimeout,
  DEFAULT_AGENT_CONFIG,
} from "./utils";

/**
 * Logical model mapping:
 * - Q&A / RAG: GLM-4-32B (efficient but capable)
 *
 * The concrete model name can be overridden via environment variable.
 */
const openai = createOpenAI({
  apiKey: ENV.zaiApiKey || process.env.BUILT_IN_FORGE_API_KEY,
  baseURL:
    ENV.zaiBaseUrl ||
    (process.env.BUILT_IN_FORGE_API_URL
      ? `${process.env.BUILT_IN_FORGE_API_URL}/v1`
      : "https://api.z.ai/api/paas/v4"),
  fetch: createPatchedFetch(fetch),
});

const QA_MODEL_NAME = process.env.MEETINGMIND_QA_MODEL ?? "glm-4-32b";

const model = openai.chat(QA_MODEL_NAME);

export interface QAResult {
  answer: string;
  confidence: "high" | "medium" | "low";
  sources?: string[];
}

export async function answerQuestionAboutMeeting(
  transcript: string,
  question: string
): Promise<QAResult> {
  try {
    // Validate inputs
    const validatedTranscript = validateTranscript(transcript);
    const validatedQuestion = validateQuestion(question);

    // Execute with retry and timeout
    const result = await withRetry(
      () =>
        withTimeout(
          generateText({
            model,
            system: `You are a meeting assistant. Answer questions about the meeting transcript provided.
Be concise, accurate, and cite specific details from the transcript when relevant.
If the answer is not in the transcript, say so clearly.
Provide confidence level: high (directly stated), medium (inferred), or low (not clearly in transcript).`,
            prompt: `Meeting Transcript:\n${validatedTranscript}\n\nQuestion: ${validatedQuestion}\n\nProvide answer and confidence level.`,
            temperature: 0.5, // Lower temperature for factual Q&A
          }),
          DEFAULT_AGENT_CONFIG.timeoutMs
        ),
      { maxRetries: DEFAULT_AGENT_CONFIG.maxRetries }
    );

    // Parse response for confidence level
    const text = result.text.toLowerCase();
    let confidence: "high" | "medium" | "low" = "medium";

    if (text.includes("high confidence") || text.includes("directly stated")) {
      confidence = "high";
    } else if (
      text.includes("not in") ||
      text.includes("not found") ||
      text.includes("low confidence")
    ) {
      confidence = "low";
    }

    return {
      answer: result.text,
      confidence,
      sources: extractSourcesFromTranscript(
        validatedTranscript,
        validatedQuestion
      ),
    };
  } catch (error) {
    console.error("[QAAgent] Error:", error);
    throw new Error(
      `Failed to answer question: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Extract relevant sources/quotes from transcript
 */
function extractSourcesFromTranscript(
  transcript: string,
  question: string
): string[] {
  const keywords = question.split(/\s+/).filter(w => w.length > 3);
  const lines = transcript.split("\n");
  const sources: string[] = [];

  for (const line of lines) {
    const lineLower = line.toLowerCase();
    if (keywords.some(kw => lineLower.includes(kw.toLowerCase()))) {
      sources.push(line.trim());
      if (sources.length >= 3) break;
    }
  }

  return sources;
}

/**
 * Multi-turn Q&A with context
 */
export async function answerMultipleQuestions(
  transcript: string,
  questions: string[]
): Promise<QAResult[]> {
  const results = await Promise.allSettled(
    questions.map(q => answerQuestionAboutMeeting(transcript, q))
  );

  return results.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    }
    console.error(`[QAAgent] Question ${index} failed:`, result.reason);
    return {
      answer: "Unable to answer this question",
      confidence: "low",
    };
  });
}

/**
 * Search transcript for specific topics
 */
export async function searchTranscriptTopic(
  transcript: string,
  topic: string
): Promise<string[]> {
  try {
    const validatedTranscript = validateTranscript(transcript);
    const validatedTopic = validateQuestion(topic); // Reuse validation

    const result = await withRetry(
      () =>
        withTimeout(
          generateText({
            model,
            system: `Extract all relevant passages from the transcript that discuss or relate to the given topic.
Return a JSON array of strings, each being a relevant quote or passage.
If no relevant passages found, return empty array.`,
            prompt: `Topic: ${validatedTopic}\n\nTranscript:\n${validatedTranscript}\n\nReturn JSON array of relevant passages.`,
            temperature: 0.5,
          }),
          DEFAULT_AGENT_CONFIG.timeoutMs
        ),
      { maxRetries: 2 }
    );

    try {
      return JSON.parse(result.text);
    } catch {
      return [];
    }
  } catch (error) {
    console.error("[QAAgent] Search error:", error);
    return [];
  }
}
;

    try {
      return JSON.parse(result.text);
    } catch {
      return [];
    }
  } catch (error) {
    console.error("[QAAgent] Search error:", error);
    return [];
  }
}
