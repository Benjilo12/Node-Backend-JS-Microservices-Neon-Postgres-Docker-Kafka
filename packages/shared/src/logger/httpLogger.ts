import { pinoHttp } from "pino-http";
import { logger } from "./logger.js";

//* HTTP logger middleware for Express */
export const httpLogger = pinoHttp({
  logger: logger,
});
