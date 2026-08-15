import { config } from "dotenv";
import express from "express";
import { resolve } from "path";
import {
  errorHandler,
  httpLogger,
  logger,
  requireGatewaySecret,
  successResponse,
} from "shared";
import authRoutes from "./routes/auth.routes.js";

config({ path: resolve(process.cwd(), ".env") });

config({ path: resolve(process.cwd(), "../../.env") });

//* Auth service entry point
const AUTH_PORT = process.env.AUTH_PORT || 3001;

//* Create an Express application and set up middleware */
const app = express();

//* Use HTTP logger middleware for logging requests */
app.use(httpLogger);
app.use(express.json());

//* Health check endpoint */
app.get("/health", (_req, res) => {
  successResponse(res, { service: "auth-service" });
});
//* Use auth routes for handling authentication-related requests */
app.use("/auth", requireGatewaySecret, authRoutes);

//* Handle 404 errors for undefined routes */
app.use((_req, _res, next) => {
  next(new Error("Not Found"));
});

app.use(errorHandler);

//* Start the server and listen on the specified port */
app.listen(AUTH_PORT, () => {
  logger.info(`Auth service is running on port ${AUTH_PORT}`);
});
