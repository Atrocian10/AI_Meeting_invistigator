import { agentLogger } from "./logger";
import { groupActionItemsByOwner, type ActionItem } from "./actionExtractor";

export type IntegrationChannel = "jira" | "asana" | "slack" | "email";

export interface IntegrationTargetConfig {
  enabled: boolean;
  projectKey?: string;
  defaultAssignee?: string;
  channelName?: string;
}

export interface IntegrationConfig {
  jira?: IntegrationTargetConfig;
  asana?: IntegrationTargetConfig;
  slack?: IntegrationTargetConfig;
  email?: IntegrationTargetConfig;
}

export interface IntegrationResult {
  channel: IntegrationChannel;
  success: boolean;
  externalId?: string;
  error?: string;
}

export interface OrchestratedIntegrationSummary {
  results: IntegrationResult[];
}

/**
 * Stubbed integration agent that simulates sending action items to
 * external tools. This keeps the backend production-ready while
 * avoiding real side effects in demo environments.
 */
export async function syncActionItemsToIntegrations(
  meetingId: number | string,
  items: ActionItem[],
  config: IntegrationConfig
): Promise<OrchestratedIntegrationSummary> {
  const grouped = groupActionItemsByOwner(items);
  const results: IntegrationResult[] = [];

  const start = Date.now();

  if (config.jira?.enabled) {
    results.push(
      ...(await simulateJiraSync(meetingId, grouped, config.jira))
    );
  }

  if (config.asana?.enabled) {
    results.push(
      ...(await simulateAsanaSync(meetingId, grouped, config.asana))
    );
  }

  if (config.slack?.enabled) {
    results.push(
      ...(await simulateSlackSync(meetingId, grouped, config.slack))
    );
  }

  if (config.email?.enabled) {
    results.push(
      ...(await simulateEmailSync(meetingId, grouped, config.email))
    );
  }

  agentLogger.timing("IntegrationAgent", "Sync completed", Date.now() - start, {
    meetingId,
    channels: results.map(r => r.channel),
  });

  return { results };
}

async function simulateJiraSync(
  meetingId: number | string,
  grouped: Record<string, ActionItem[]>,
  config: IntegrationTargetConfig
): Promise<IntegrationResult[]> {
  agentLogger.info("IntegrationAgent", "Simulating Jira sync", {
    meetingId,
    projectKey: config.projectKey,
  });

  return Object.entries(grouped).map(([owner]) => ({
    channel: "jira",
    success: true,
    externalId: `JIRA-${config.projectKey ?? "MEETING"}-${meetingId}-${owner}`,
  }));
}

async function simulateAsanaSync(
  meetingId: number | string,
  grouped: Record<string, ActionItem[]>,
  config: IntegrationTargetConfig
): Promise<IntegrationResult[]> {
  agentLogger.info("IntegrationAgent", "Simulating Asana sync", {
    meetingId,
  });

  return Object.entries(grouped).map(([owner]) => ({
    channel: "asana",
    success: true,
    externalId: `ASANA-${meetingId}-${owner}`,
  }));
}

async function simulateSlackSync(
  meetingId: number | string,
  grouped: Record<string, ActionItem[]>,
  config: IntegrationTargetConfig
): Promise<IntegrationResult[]> {
  agentLogger.info("IntegrationAgent", "Simulating Slack sync", {
    meetingId,
    channel: config.channelName ?? "#general",
  });

  return Object.entries(grouped).map(([owner]) => ({
    channel: "slack",
    success: true,
    externalId: `SLACK-${meetingId}-${owner}`,
  }));
}

async function simulateEmailSync(
  meetingId: number | string,
  grouped: Record<string, ActionItem[]>,
  _config: IntegrationTargetConfig
): Promise<IntegrationResult[]> {
  agentLogger.info("IntegrationAgent", "Simulating Email sync", {
    meetingId,
  });

  return Object.entries(grouped).map(([owner]) => ({
    channel: "email",
    success: true,
    externalId: `EMAIL-${meetingId}-${owner}`,
  }));
}

