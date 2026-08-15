import type { Consumer, EachMessagePayload } from "kafkajs";
import { createKafkaClient } from "./client.js";
import { logger } from "../logger/logger.js";

export async function createConsumer(
  clientId: string,
  groupID: string,
): Promise<Consumer> {
  const Kafka = createKafkaClient(clientId);

  const consumer = Kafka.consumer({ groupId: groupID });

  await consumer.connect();

  logger.info({ clientId, groupID }, "Kafka consumer connected");

  return consumer;
}

// subscribe to the topic names
// start a poll
// call business handler for every/each message

// runconsumer(consumer, [topic1, topic2, topic3], async({message})=> insert task workflows)

export async function runConsumer(
  consumer: Consumer,
  topics: string[],
  handler: (payload: EachMessagePayload) => Promise<void>,
  options?: { fromBeginning?: boolean },
): Promise<void> {
  await consumer.subscribe({
    topics,
    fromBeginning: options?.fromBeginning ?? false,
  });

  await consumer.run({
    eachMessage: async (payload) => {
      const { topic, partition, message } = payload;

      logger.info(
        {
          topic,
          partition,
          offset: message.offset,
          key: message?.key?.toString(),
        },
        "Kafka messages received",
      );

      await handler(payload);
    },
  });
}
