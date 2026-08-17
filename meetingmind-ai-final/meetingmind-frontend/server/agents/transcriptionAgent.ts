import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createPatchedFetch } from "../_core/patchedFetch";
import { ENV } from "../_core/env";
import {
  withRetry,
  withTimeout,
  DEFAULT_AGENT_CONFIG,
  sanitizeText,
  truncateText,
  extractJson,
  safeJsonParse,
} from "./utils";

/**
 * Transcription Agent
 *
 * This agent is responsible for taking raw speech-to-text output
 * (possibly noisy, no punctuation, inconsistent casing, partial speaker
 * labels) and producing a cleaned, speaker-labelled transcript that is
 * suitable for downstream agents.
 *
 * Logical model mapping:
 * - Transcription cleanup: GLM-4.5-Air (fast, low-latency)
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

const TRANSCRIPTION_MODEL_NAME =
  process.env.MEETINGMIND_TRANSCRIPTION_MODEL ?? "glm-4.5-air";

const model = openai.chat(TRANSCRIPTION_MODEL_NAME);

export interface SpeakerTurn {
  speaker: string;
  text: string;
}

export interface TranscriptionResult {
  cleanedTranscript: string;
  turns: SpeakerTurn[];
}

export async function enhanceTranscript(
  rawTranscript: string
): Promise<TranscriptionResult> {
  const trimmed = truncateText(rawTranscript.trim(), 100_000);

  if (trimmed.length < 10) {
    throw new Error("Raw transcript is too short to enhance");
  }

  // Light local normalization first to make the LLM's job easier and
  // cheaper, while still allowing it to fully reformat the text.
  const preprocessed = sanitizeText(trimmed);

  const result = await withRetry(
    () =>
      withTimeout(
        generateText({
          model,
          system: `You are a real-time transcription enhancement agent for meetings.

First think through the messy transcript, then output ONLY JSON.

Your job:
- Fix obvious ASR errors while preserving meaning
- Add punctuation and sentence boundaries
- Normalize casing (sentence case)
- Infer and label speakers as "Speaker 1", "Speaker 2", etc. when not explicit
- Keep utterances in chronological order

Format your final response as pure JSON with keys:
- "cleanedTranscript": string (full readable transcript)
- "turns": array of { "speaker": string, "text": string } in order.`,
          prompt: `Enhance the following raw speech-to-text transcript for a meeting.

Raw transcript:
${preprocessed}`,
          temperature: 0.3,
        }),
        DEFAULT_AGENT_CONFIG.timeoutMs
      ),
    { maxRetries: DEFAULT_AGENT_CONFIG.maxRetries }
  );

  try {
    const jsonText = extractJson(result.text);
    const parsed = safeJsonParse<TranscriptionResult>(
      jsonText,
      {
        cleanedTranscript: trimmed,
        turns: [{ speaker: "Speaker 1", text: trimmed }],
      }
    );

    if (
      !parsed.cleanedTranscript ||
      !Array.isArray(parsed.turns) ||
      parsed.turns.length === 0
    ) {
      throw new Error("Invalid transcription structure");
    }

    return parsed;
  } catch (error) {
    console.error("[TranscriptionAgent] JSON parse error:", error);
    return {
      cleanedTranscript: trimmed,
      turns: [{ speaker: "Speaker 1", text: trimmed }],
    };
  }
}

