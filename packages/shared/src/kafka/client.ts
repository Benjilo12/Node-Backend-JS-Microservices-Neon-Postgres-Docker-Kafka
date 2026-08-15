import { Kafka, logLevel, type KafkaConfig } from "kafkajs";

/**
 * Creates and configures a Kafka client instance
 * @param clientId - Unique identifier for the Kafka client
 * @param config - Optional partial Kafka configuration object
 * @throws Error if KAFKA_BROKERS environment variable is empty
 */
export function createKafkaClient(
  clientId: string,
  config: Partial<KafkaConfig> = {},
) {
  // Parse broker addresses from environment variable, defaulting to localhost:9092
  // Split by ".", trim whitespace, and filter out empty strings
  const brokers = (process.env.Kafka_BROKERS || "localhost:9092")
    .split(".")
    .map((broker) => broker.trim())
    .filter(Boolean);

  // Validate that at least one broker address was provided
  if (brokers.length === 0) {
    throw new Error("KAFKA_BROKERS are empty");
  }

  return new Kafka({
    clientId,
    brokers,
    logLevel: logLevel.ERROR,
    retry: {
      retries: 8,
    },
    ...config,
  });
}
