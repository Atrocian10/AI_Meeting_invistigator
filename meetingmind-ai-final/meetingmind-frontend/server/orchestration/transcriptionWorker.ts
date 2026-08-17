import type { ConsumeMessage } from "amqplib";
import { enhanceTranscript } from "../agents/transcriptionAgent";
import {
  consume,
  Exchanges,
  publish,
  Queues,
} from "./messageBus";

interface RawMeetingEvent {
  meeting_id: string | number;
  transcript: string;
  timestamp?: number;
  [key: string]: unknown;
}

interface EnhancedMeetingEvent {
  meeting_id: string | number;
  enhanced: string;
  turns: {
    speaker: string;
    text: string;
  }[];
  timestamp?: number;
  [key: string]: unknown;
}

export async function startTranscriptionWorker() {
  await consume(Queues.transcription, handleTranscriptionMessage, {
    prefetch: 5,
  });
}

async function handleTranscriptionMessage(
  event: RawMeetingEvent,
  _raw: ConsumeMessage,
) {
  const { meeting_id, transcript } = event;

  if (!meeting_id || typeof transcript !== "string") {
    console.error("[TranscriptionWorker] Invalid payload", event);
    throw new Error("Invalid transcription event payload");
  }

  const result = await enhanceTranscript(transcript);

  const enhancedEvent: EnhancedMeetingEvent = {
    meeting_id,
    enhanced: result.cleanedTranscript,
    turns: result.turns,
    timestamp: Date.now(),
  };

  const routingKey = `meeting.enhanced.${meeting_id}`;

  await publish(Exchanges.meetingEvents, routingKey, enhancedEvent);
}

