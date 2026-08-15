import pino from "pino";

//*logger.ts creates a logging instance using pino.
//*It is used to log messages and errors consistently across the services.
export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
});
