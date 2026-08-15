import { config } from "dotenv";
import { resolve } from "node:path";
import express from "express";
import {
  AppError,
  errorHandler,
  httpLogger,
  logger,
  requireGatewaySecret,
  successResponse,
} from "shared";
import taskRoutes from "./routes/task.routes";
import { initKafka } from "./kafka";

// Load environment variables from application and workspace-level .env files.
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });

const TASK_PORT = process.env.TASK_PORT || 3002;

const app = express();

// Request logging and JSON body parsing for all incoming requests.
app.use(httpLogger);
app.use(express.json());

// Health check endpoint used by load balancers and service monitors.
app.use("/health", (_req, res) => {
  successResponse(res, { service: "task-gateway" });
});

// Task routes are protected by the gateway secret middleware.
app.use("/tasks", requireGatewaySecret, taskRoutes);

// Catch-all 404 handler for unknown routes.
app.use((_req, _res, next) => {
  next(new AppError(404, "Route not found"));
});

// Centralized error handling middleware.
app.use(errorHandler);

async function initStartUp() {
  try {
    await initKafka;
  } catch (err) {
    logger.error({ err }, "kafka producer init failed");
  }
}
// Start the task service on the configured port.
app.listen(TASK_PORT, () => {
  logger.info(`API Task running on port ${TASK_PORT}`);
});

initStartUp();
