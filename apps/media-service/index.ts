import { config } from "dotenv";
import express from "express";
import { resolve } from "node:path";
import {
  AppError,
  errorHandler,
  httpLogger,
  logger,
  successResponse,
  requireGatewaySecret,
} from "shared";
import attachmentRoutes from "./src/routes/media.routes";
import { initKafka } from "./src/kafka";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });

const MEDIA_PORT = process.env.MEDIA_PORT || 3000;

const app = express();

app.use(httpLogger);

app.get("/health", (_req, res) => {
  successResponse(res, { service: "media-service" });
});

app.use("/tasks", requireGatewaySecret, attachmentRoutes);

// Catch-all 404 handler for unknown routes.
app.use((_req, _res, next) => {
  next(new AppError(404, "Route not found"));
});

// Centralized error handling middleware.
app.use(errorHandler);

async function initStartUp() {
  try {
    await initKafka();
  } catch (err) {
    logger.error({ err }, "kafka producer init failed");
  }

  // Start the task service on the configured port.
  app.listen(MEDIA_PORT, () => {
    logger.info(`API Task running on port $MEDIA_PORT}`);
  });
}
