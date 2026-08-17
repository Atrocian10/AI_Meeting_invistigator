import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createPatchedFetch } from "../_core/patchedFetch";
import { ENV } from "../_core/env";
import { z } from "zod";
import {
  withRetry,
  validateTranscript,
  safeJsonParse,
  extractJson,
  withTimeout,
  DEFAULT_AGENT_CONFIG,
} from "./utils";
import { summaryCache } from "./cache";

/**
 * Logical model mapping:
 * - Summarization: GLM-4.7 (thinking mode capable)
 *
 * The concrete model name can be overridden via environment variable
 * to keep the codebase vendor-agnostic while still demonstrating
 * specialized agent configuration.
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

const SUMMARIZER_MODEL_NAME =
  process.env.MEETINGMIND_SUMMARIZER_MODEL ?? "glm-4.7";

const model = openai.chat(SUMMARIZER_MODEL_NAME);

export interface SummaryResult {
  summary: string;
  keyPoints: string[];
  participants: string[];
}

const SummarySchema = z.object({
  summary: z.string().min(10),
  keyPoints: z.array(z.string()).min(1).max(10),
  participants: z.array(z.string()).max(50),
});

export async function summarizeTranscript(
  transcript: string
): Promise<SummaryResult> {
  try {
    // Check cache first
    const cached = summaryCache.get(transcript);
    if (cached) {
      return cached;
    }

    // Validate input
    const validatedTranscript = validateTranscript(transcript);

    // Execute with retry and timeout. The prompt explicitly asks the
    // model to reason step-by-step before producing the final JSON so
    // that GLM "thinking mode" style models can be used where available.
    const result = await withRetry(
      () =>
        withTimeout(
          generateText({
            model,
            system: `You are an expert meeting analyst.
First, silently think step-by-step about the discussion, decisions, and participants.
Then output ONLY JSON matching the schema described below.

You are analysing a single meeting transcript, which may be long.`,
            prompt: `Analyze this meeting transcript and return structured JSON.

REQUIREMENTS:
- Provide a concise executive summary (2-3 sentences)
- Extract 3-10 key discussion points (short bullet-style strings)
- Extract a list of participant names or roles

Return JSON with keys:
- "summary": string
- "keyPoints": string[]
- "participants": string[]

Transcript:
${validatedTranscript}`,
            temperature: DEFAULT_AGENT_CONFIG.temperature,
          }),
          DEFAULT_AGENT_CONFIG.timeoutMs
        ),
      { maxRetries: DEFAULT_AGENT_CONFIG.maxRetries }
    );

    // Extract and parse JSON
    const jsonText = extractJson(result.text);
    const parsed = safeJsonParse<SummaryResult>(
      jsonText,
      {
        summary: "Unable to generate summary",
        keyPoints: [],
        participants: [],
      },
      SummarySchema
    );

    // Cache successful result
    summaryCache.set(transcript, parsed);

    return parsed;
  } catch (error) {
    console.error("[Summarizer] Error:", error);
    throw new Error(
      `Failed to summarize transcript: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Batch summarize multiple transcripts
 */
export async function summarizeTranscriptsBatch(
  transcripts: string[]
): Promise<SummaryResult[]> {
  const results = await Promise.allSettled(
    transcripts.map(t => summarizeTranscript(t))
  );

  return results.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    }
    console.error(`[Summarizer] Batch item ${index} failed:`, result.reason);
    return {
      summary: "Failed to process",
      keyPoints: [],
      participants: [],
    };
  });
}
