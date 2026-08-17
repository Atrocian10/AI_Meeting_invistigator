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
import { actionItemsCache } from "./cache";

/**
 * Logical model mapping:
 * - Action Extraction: GLM-4.6 (optimized for tool / function calling)
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

const ACTION_EXTRACTOR_MODEL_NAME =
  process.env.MEETINGMIND_ACTION_MODEL ?? "glm-4.6";

const model = openai.chat(ACTION_EXTRACTOR_MODEL_NAME);

export interface ActionItem {
  title: string;
  owner?: string;
  deadline?: string;
  priority: "high" | "medium" | "low";
  description?: string;
}

const ActionItemSchema = z.object({
  title: z.string().min(5),
  owner: z.string().optional(),
  deadline: z.string().optional(),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
  description: z.string().optional(),
});

const ActionItemsSchema = z.array(ActionItemSchema);

export async function extractActionItems(
  transcript: string
): Promise<ActionItem[]> {
  try {
    // Check cache first
    const cached = actionItemsCache.get(transcript);
    if (cached) {
      return cached;
    }

    // Validate input
    const validatedTranscript = validateTranscript(transcript);

    // Execute with retry and timeout. We simulate a function-calling style
    // interaction by asking the model to construct an array of
    // create_action_item calls and then extracting the JSON payloads.
    const result = await withRetry(
      () =>
        withTimeout(
          generateText({
            model,
            system: `You are an expert project manager agent that creates structured action items for downstream tools.

Think step-by-step about the transcript and then output ONLY JSON.

You conceptually have a tool called "create_action_item" with this signature:
- summary: string
- assignee: string | null
- due_date: string | null (ISO date or natural language)
- priority: "high" | "medium" | "low"
- description: string | null

Instead of natural language, return a JSON array under key "items",
where each element matches:
{ "title": string, "owner"?: string, "deadline"?: string, "priority": "high" | "medium" | "low", "description"?: string }`,
            prompt: `From the following meeting transcript, identify all clear, follow-up action items or commitments.

Return ONLY JSON as described in the system message.

Transcript:
${validatedTranscript}`,
            temperature: DEFAULT_AGENT_CONFIG.temperature,
          }),
          DEFAULT_AGENT_CONFIG.timeoutMs
        ),
      { maxRetries: DEFAULT_AGENT_CONFIG.maxRetries }
    );

    // Extract and parse JSON, allowing the model to optionally wrap
    // results as { "items": [...] } while still accepting a bare array.
    const jsonText = extractJson(result.text);
    const raw = safeJsonParse<unknown>(jsonText, []);

    const itemsArray: unknown =
      raw && typeof raw === "object" && Array.isArray((raw as any).items)
        ? (raw as any).items
        : raw;

    const parsed = safeJsonParse<ActionItem[]>(
      JSON.stringify(itemsArray),
      [],
      ActionItemsSchema
    );

    // Filter out invalid items
    const filtered = parsed.filter(
      item => item.title && item.title.length > 0
    );

    // Cache successful result
    actionItemsCache.set(transcript, filtered);

    return filtered;
  } catch (error) {
    console.error("[ActionExtractor] Error:", error);
    throw new Error(
      `Failed to extract action items: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Prioritize action items by urgency
 */
export function prioritizeActionItems(items: ActionItem[]): ActionItem[] {
  const priorityOrder = { high: 0, medium: 1, low: 2 };

  return [...items].sort((a, b) => {
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;

    // Secondary sort by deadline if present
    if (a.deadline && b.deadline) {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }

    return 0;
  });
}

/**
 * Group action items by owner
 */
export function groupActionItemsByOwner(
  items: ActionItem[]
): Record<string, ActionItem[]> {
  return items.reduce(
    (acc, item) => {
      const owner = item.owner || "Unassigned";
      if (!acc[owner]) acc[owner] = [];
      acc[owner].push(item);
      return acc;
    },
    {} as Record<string, ActionItem[]>
  );
}
