import { summarizeTranscript, SummaryResult } from "./summarizer";
import {
  extractActionItems,
  ActionItem,
  prioritizeActionItems,
} from "./actionExtractor";
import { analyzeSentiment, SentimentAnalysis } from "./sentimentAnalyzer";
import { validateTranscript } from "./utils";
import { enhanceTranscript, TranscriptionResult } from "./transcriptionAgent";
import {
  syncActionItemsToIntegrations,
  type IntegrationConfig,
  type OrchestratedIntegrationSummary,
} from "./integrationAgent";

export interface MeetingAnalysis {
  summary: SummaryResult;
  actionItems: ActionItem[];
  sentiment: SentimentAnalysis;
  processingTime: number;
  /**
   * Optional enriched metadata about how the multi-agent pipeline ran.
   * This keeps the public API backwards-compatible while allowing
   * observability into specialized agents.
   */
  meta?: {
    transcription?: TranscriptionResult;
    models?: {
      summarizer: string;
      actionExtractor: string;
      sentiment: string;
    };
    integration?: OrchestratedIntegrationSummary;
  };
}

/**
 * Orchestrate full meeting analysis
 * Runs all agents in parallel for efficiency
 */
export async function analyzeMeeting(
  transcript: string
): Promise<MeetingAnalysis> {
  const startTime = Date.now();

  try {
    // First, run the transcription enhancement agent. This is kept
    // synchronous here for simplicity, but could be offloaded to a
    // background worker in a production cluster.
    const transcription = await enhanceTranscript(transcript);

    // Validate cleaned transcript once for downstream agents
    const validatedTranscript = validateTranscript(
      transcription.cleanedTranscript
    );

    // Run core analysis agents in parallel
    const [summary, actionItems, sentiment] = await Promise.all([
      summarizeTranscript(validatedTranscript),
      extractActionItems(validatedTranscript),
      analyzeSentiment(validatedTranscript),
    ]);

    // Prioritize action items
    const prioritizedActions = prioritizeActionItems(actionItems);

    // Optional downstream integration fan-out, controlled by env flags.
    let integrationSummary: OrchestratedIntegrationSummary | undefined;
    if (process.env.MEETINGMIND_INTEGRATIONS_ENABLED === "true") {
      const config: IntegrationConfig = {
        jira: {
          enabled: process.env.MEETINGMIND_JIRA_ENABLED === "true",
          projectKey: process.env.MEETINGMIND_JIRA_PROJECT_KEY,
        },
        asana: {
          enabled: process.env.MEETINGMIND_ASANA_ENABLED === "true",
        },
        slack: {
          enabled: process.env.MEETINGMIND_SLACK_ENABLED === "true",
          channelName: process.env.MEETINGMIND_SLACK_CHANNEL,
        },
        email: {
          enabled: process.env.MEETINGMIND_EMAIL_ENABLED === "true",
        },
      };

      // In demo mode we use a synthetic meeting id; a real backend can
      // pass through the persisted meeting identifier instead.
      const meetingId = "demo";
      integrationSummary = await syncActionItemsToIntegrations(
        meetingId,
        prioritizedActions,
        config
      );
    }

    const processingTime = Date.now() - startTime;

    return {
      summary,
      actionItems: prioritizedActions,
      sentiment,
      processingTime,
      meta: {
        transcription,
        models: {
          summarizer:
            process.env.MEETINGMIND_SUMMARIZER_MODEL ?? "glm-4.7",
          actionExtractor:
            process.env.MEETINGMIND_ACTION_MODEL ?? "glm-4.6",
          sentiment:
            process.env.MEETINGMIND_SENTIMENT_MODEL ?? "glm-4.5-air",
        },
        integration: integrationSummary,
      },
    };
  } catch (error) {
    console.error("[Orchestrator] Error:", error);
    throw new Error(
      `Failed to analyze meeting: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Lightweight quick analysis (summary + action items only)
 */
export async function quickAnalyzeMeeting(
  transcript: string
): Promise<Omit<MeetingAnalysis, "sentiment">> {
  const startTime = Date.now();

  try {
    const transcription = await enhanceTranscript(transcript);
    const validatedTranscript = validateTranscript(
      transcription.cleanedTranscript
    );

    const [summary, actionItems] = await Promise.all([
      summarizeTranscript(validatedTranscript),
      extractActionItems(validatedTranscript),
    ]);

    const prioritizedActions = prioritizeActionItems(actionItems);
    const processingTime = Date.now() - startTime;

    return {
      summary,
      actionItems: prioritizedActions,
      processingTime,
      meta: {
        transcription,
        models: {
          summarizer:
            process.env.MEETINGMIND_SUMMARIZER_MODEL ?? "glm-4.7",
          actionExtractor:
            process.env.MEETINGMIND_ACTION_MODEL ?? "glm-4.6",
          sentiment:
            process.env.MEETINGMIND_SENTIMENT_MODEL ?? "glm-4.5-air",
        },
      },
    };
  } catch (error) {
    console.error("[Orchestrator] Quick analysis error:", error);
    throw new Error(
      `Failed to perform quick analysis: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Generate meeting report
 */
export function generateMeetingReport(analysis: MeetingAnalysis): string {
  const { summary, actionItems, sentiment, processingTime } = analysis;

  const lines = [
    "=== MEETING ANALYSIS REPORT ===\n",
    `Processing Time: ${processingTime}ms\n`,
    "\n--- EXECUTIVE SUMMARY ---",
    summary.summary,
    "\n--- KEY POINTS ---",
    summary.keyPoints.map(p => `• ${p}`).join("\n"),
    "\n--- PARTICIPANTS ---",
    summary.participants.map(p => `• ${p}`).join("\n"),
    "\n--- SENTIMENT ANALYSIS ---",
    `Overall: ${sentiment.overallSentiment.toUpperCase()} (Score: ${sentiment.score.toFixed(2)})`,
    `Tone: ${sentiment.emotionalTone}`,
    sentiment.concerns.length > 0
      ? `\nConcerns:\n${sentiment.concerns.map(c => `• ${c}`).join("\n")}`
      : "",
    sentiment.highlights.length > 0
      ? `\nHighlights:\n${sentiment.highlights.map(h => `• ${h}`).join("\n")}`
      : "",
    "\n--- ACTION ITEMS ---",
    actionItems.length > 0
      ? actionItems
          .map(
            (item, i) =>
              `${i + 1}. [${item.priority.toUpperCase()}] ${item.title}${
                item.owner ? ` (Owner: ${item.owner})` : ""
              }${item.deadline ? ` - Due: ${item.deadline}` : ""}`
          )
          .join("\n")
      : "No action items identified",
    "\n=== END REPORT ===",
  ];

  return lines.filter(line => line !== "").join("\n");
}
