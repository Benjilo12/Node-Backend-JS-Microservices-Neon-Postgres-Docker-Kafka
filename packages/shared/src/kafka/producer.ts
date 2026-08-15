import { Kafka, Producer, RecordMetadata } from "kafkajs";
import { createKafkaClient } from "./client.js";
import { logger } from "../logger/logger.js";

export async function createProducer(clientId: string): Promise<Producer> {
  const Kafka = createKafkaClient(clientId);

  const Producer = Kafka.producer();

  await Producer.connect();

  logger.info({ clientId }, "kafka producer connected");

  return Producer;
}

export async function publishJson(
  producer: Producer,
  topic: string,
  payload: Record<string, unknown>,
  key?: string,
): Promise<RecordMetadata[]> {
  const result = await producer.send({
    topic,
    messages: [
      {
        key: key ?? null,
        value: JSON.stringify(payload),
      },
    ],
  });

  logger.info({ topic, payload }, "Kafka event publised");

  return result;
}

export async function publishJsonSafe(
  producer: Producer | null,
  topic: string,
  payload: Record<string, unknown>,
  key?: string,
): Promise<void> {
  if (!producer) {
    logger.warn({ topic }, "kafka producer is not ready");
    return;
  }

  try {
    await publishJson(producer, topic, payload, key);
  } catch (err) {
    logger.error({ err, topic }, "kafka publish failed");
  }
}
