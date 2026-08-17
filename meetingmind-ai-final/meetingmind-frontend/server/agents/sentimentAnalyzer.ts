import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createPatchedFetch } from "../_core/patchedFetch";
import { z } from "zod";
import {
  withRetry,
  validateTranscript,
  safeJsonParse,
  extractJson,
  withTimeout,
  DEFAULT_AGENT_CONFIG,
} from "./utils";
import { sentimentCache } from "./cache";

/**
 * Logical model mapping:
 * - Sentiment: GLM-4.5-Air (fast, good for lightweight analysis)
 *
 * The concrete model name can be overridden via environment variable.
 */
const openai = createOpenAI({
  apiKey: process.env.BUILT_IN_FORGE_API_KEY,
  baseURL: `${process.env.BUILT_IN_FORGE_API_URL}/v1`,
  fetch: createPatchedFetch(fetch),
});

const SENTIMENT_MODEL_NAME =
  process.env.MEETINGMIND_SENTIMENT_MODEL ?? "glm-4.5-air";

const model = openai.chat(SENTIMENT_MODEL_NAME);

export type SentimentType = "positive" | "neutral" | "negative";

export interface SentimentAnalysis {
  overallSentiment: SentimentType;
  score: number; // -1 to 1
  topicSentiments: Record<string, SentimentType>;
  emotionalTone: string;
  concerns: string[];
  highlights: string[];
}

const SentimentSchema = z.object({
  overallSentiment: z.enum(["positive", "neutral", "negative"]),
  score: z.number().min(-1).max(1),
  topicSentiments: z.record(
    z.string(),
    z.enum(["positive", "neutral", "negative"])
  ),
  emotionalTone: z.string(),
  concerns: z.array(z.string()),
  highlights: z.array(z.string()),
});

export async function analyzeSentiment(
  transcript: string
): Promise<SentimentAnalysis> {
  try {
    // Check cache first
    const cached = sentimentCache.get(transcript);
    if (cached) {
      return cached;
    }

    const validatedTranscript = validateTranscript(transcript);

    const result = await withRetry(
      () =>
        withTimeout(
          generateText({
            model,
            system: `You are an expert sentiment analyst. Analyze the meeting transcript and provide:
1. Overall sentiment (positive/neutral/negative)
2. Sentiment score (-1 to 1, where -1 is very negative, 0 is neutral, 1 is very positive)
3. Sentiment for each major topic discussed
4. Emotional tone of the meeting
5. Key concerns or issues raised
6. Key highlights or positive points

Format response as JSON with keys: overallSentiment, score, topicSentiments (object), emotionalTone, concerns (array), highlights (array)`,
            prompt: `Analyze the sentiment of this meeting transcript:\n\n${validatedTranscript}`,
            temperature: 0.5,
          }),
          DEFAULT_AGENT_CONFIG.timeoutMs
        ),
      { maxRetries: DEFAULT_AGENT_CONFIG.maxRetries }
    );

    const jsonText = extractJson(result.text);
    const parsed = safeJsonParse<SentimentAnalysis>(
      jsonText,
      {
        overallSentiment: "neutral",
        score: 0,
        topicSentiments: {},
        emotionalTone: "Professional",
        concerns: [],
        highlights: [],
      },
      SentimentSchema
    );

    // Cache successful result
    sentimentCache.set(transcript, parsed);

    return parsed;
  } catch (error) {
    console.error("[SentimentAnalyzer] Error:", error);
    throw new Error(
      `Failed to analyze sentiment: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Get sentiment emoji/color indicator
 */
export function getSentimentIndicator(sentiment: SentimentType): {
  emoji: string;
  color: string;
  label: string;
} {
  const indicators = {
    positive: { emoji: "😊", color: "green", label: "Positive" },
    neutral: { emoji: "😐", color: "gray", label: "Neutral" },
    negative: { emoji: "😞", color: "red", label: "Negative" },
  };
  return indicators[sentiment];
}

/**
 * Compare sentiment across multiple transcripts
 */
export async function compareSentiments(
  transcripts: string[]
): Promise<SentimentAnalysis[]> {
  const results = await Promise.allSettled(
    transcripts.map(t => analyzeSentiment(t))
  );

  return results.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    }
    console.error(
      `[SentimentAnalyzer] Transcript ${index} failed:`,
      result.reason
    );
    return {
      overallSentiment: "neutral" as const,
      score: 0,
      topicSentiments: {},
      emotionalTone: "Unable to analyze",
      concerns: [],
      highlights: [],
    };
  });
}
