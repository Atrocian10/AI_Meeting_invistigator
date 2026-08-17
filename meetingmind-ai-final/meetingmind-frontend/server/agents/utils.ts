import { z } from "zod";

export interface AgentConfig {
  maxRetries: number;
  retryDelayMs: number;
  timeoutMs: number;
  temperature: number;
}

export const DEFAULT_AGENT_CONFIG: AgentConfig = {
  maxRetries: 3,
  retryDelayMs: 1000,
  timeoutMs: 30000,
  temperature: 0.7,
};

/**
 * Retry logic with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<AgentConfig> = {}
): Promise<T> {
  const { maxRetries, retryDelayMs } = { ...DEFAULT_AGENT_CONFIG, ...config };

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(
        `[Agent] Attempt ${attempt + 1}/${maxRetries + 1} failed:`,
        lastError.message
      );

      if (attempt < maxRetries) {
        const delay = retryDelayMs * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(
    `Failed after ${maxRetries + 1} attempts. Last error: ${lastError?.message}`
  );
}

/**
 * Input validation for transcripts
 */
export function validateTranscript(transcript: string): string {
  if (!transcript || typeof transcript !== "string") {
    throw new Error("Transcript must be a non-empty string");
  }

  const trimmed = transcript.trim();
  if (trimmed.length < 10) {
    throw new Error("Transcript is too short (minimum 10 characters)");
  }

  if (trimmed.length > 100000) {
    throw new Error("Transcript is too long (maximum 100,000 characters)");
  }

  return trimmed;
}

/**
 * Input validation for questions
 */
export function validateQuestion(question: string): string {
  if (!question || typeof question !== "string") {
    throw new Error("Question must be a non-empty string");
  }

  const trimmed = question.trim();
  if (trimmed.length < 3) {
    throw new Error("Question is too short (minimum 3 characters)");
  }

  if (trimmed.length > 500) {
    throw new Error("Question is too long (maximum 500 characters)");
  }

  return trimmed;
}

/**
 * Safe JSON parsing with fallback
 */
export function safeJsonParse<T>(
  text: string,
  fallback: T,
  schema?: z.ZodSchema
): T {
  try {
    const parsed = JSON.parse(text);

    if (schema) {
      return schema.parse(parsed) as T;
    }

    return parsed as T;
  } catch (error) {
    console.error("[Agent] JSON parse error:", error);
    return fallback;
  }
}

/**
 * Extract JSON from text that may contain extra content
 */
export function extractJson(text: string): string {
  const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("No JSON found in response");
  }
  return jsonMatch[0];
}

/**
 * Sanitize text for consistent processing
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/\s+/g, " ") // Normalize whitespace
    .replace(/[^\w\s.,!?;:()\-'"]/g, "") // Remove special characters
    .trim();
}

/**
 * Truncate text to max length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

/**
 * Create timeout promise
 */
export function createTimeout<T>(
  ms: number,
  message: string = "Operation timed out"
): Promise<T> {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error(message)), ms)
  );
}

/**
 * Race between operation and timeout
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  return Promise.race<T>([promise, createTimeout<T>(timeoutMs)]);
}
