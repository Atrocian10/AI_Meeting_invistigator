import amqp, {
  Channel,
  Connection,
  ConsumeMessage,
  Options,
} from "amqplib";

type MessageHandler = (payload: any, raw: ConsumeMessage) => Promise<void>;

let connection: Connection | null = null;
let channel: Channel | null = null;

const RABBITMQ_URL =
  process.env.RABBITMQ_URL ?? "amqp://guest:guest@localhost:5672";

const EXCHANGES = {
  meetingEvents: "meeting.events",
  userQueries: "user.queries",
  integrationCommands: "integration.commands",
  dlx: "dlx",
} as const;

const QUEUES = {
  transcription: "transcription_queue",
  summary: "summary_queue",
  action: "action_queue",
  integration: "integration_queue",
  qa: "qa_queue",
  deadLetter: "dead_letter_queue",
} as const;

export async function initMessageBus() {
  if (connection && channel) return { connection, channel };

  connection = await amqp.connect(RABBITMQ_URL);
  channel = await connection.createChannel();

  // Core exchanges
  await channel.assertExchange(EXCHANGES.meetingEvents, "topic", {
    durable: true,
  });
  await channel.assertExchange(EXCHANGES.userQueries, "direct", {
    durable: true,
  });
  await channel.assertExchange(EXCHANGES.integrationCommands, "direct", {
    durable: true,
  });
  await channel.assertExchange(EXCHANGES.dlx, "fanout", {
    durable: true,
  });

  // Queues with basic dead-lettering
  await channel.assertQueue(QUEUES.transcription, {
    durable: true,
    deadLetterExchange: EXCHANGES.dlx,
  });
  await channel.assertQueue(QUEUES.summary, {
    durable: true,
    deadLetterExchange: EXCHANGES.dlx,
  });
  await channel.assertQueue(QUEUES.action, {
    durable: true,
    deadLetterExchange: EXCHANGES.dlx,
  });
  await channel.assertQueue(QUEUES.integration, {
    durable: true,
    deadLetterExchange: EXCHANGES.dlx,
  });
  await channel.assertQueue(QUEUES.qa, {
    durable: true,
    deadLetterExchange: EXCHANGES.dlx,
  });
  await channel.assertQueue(QUEUES.deadLetter, {
    durable: true,
  });

  // Bindings
  await channel.bindQueue(
    QUEUES.transcription,
    EXCHANGES.meetingEvents,
    "meeting.raw.*",
  );

  await channel.bindQueue(
    QUEUES.summary,
    EXCHANGES.meetingEvents,
    "meeting.enhanced.*",
  );

  await channel.bindQueue(
    QUEUES.action,
    EXCHANGES.meetingEvents,
    "meeting.enhanced.*",
  );

  await channel.bindQueue(
    QUEUES.integration,
    EXCHANGES.meetingEvents,
    "meeting.actions.*",
  );

  await channel.bindQueue(
    QUEUES.qa,
    EXCHANGES.userQueries,
    "user.query.*",
  );

  await channel.bindQueue(QUEUES.deadLetter, EXCHANGES.dlx, "");

  process.on("SIGINT", async () => {
    await shutdownMessageBus();
    process.exit(0);
  });

  return { connection, channel };
}

export async function shutdownMessageBus() {
  if (channel) {
    await channel.close().catch(() => {});
    channel = null;
  }
  if (connection) {
    await connection.close().catch(() => {});
    connection = null;
  }
}

function getChannel(): Channel {
  if (!channel) {
    throw new Error("Message bus not initialized. Call initMessageBus() first.");
  }
  return channel;
}

export async function publish(
  exchange: string,
  routingKey: string,
  payload: unknown,
  options: Options.Publish = {},
) {
  const ch = getChannel();
  const body = Buffer.from(JSON.stringify(payload));

  ch.publish(exchange, routingKey, body, {
    contentType: "application/json",
    persistent: true,
    ...options,
  });
}

export async function consume(
  queue: string,
  handler: MessageHandler,
  options: { prefetch?: number } = {},
) {
  const ch = getChannel();
  if (options.prefetch && options.prefetch > 0) {
    ch.prefetch(options.prefetch);
  }

  await ch.consume(queue, async (raw) => {
    if (!raw) return;

    try {
      const content =
        raw.properties.contentType === "application/json"
          ? JSON.parse(raw.content.toString("utf-8"))
          : raw.content.toString("utf-8");

      await handler(content, raw);
      ch.ack(raw);
    } catch (error) {
      console.error("[MessageBus] Handler error, dead-lettering message:", error);
      ch.nack(raw, false, false);
    }
  });
}

export const Exchanges = EXCHANGES;
export const Queues = QUEUES;

