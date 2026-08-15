import { Request, Response, NextFunction } from "express";
import { AppError } from "./AppErrors.js";

//* Error handler middleware for Express
//*errorHandler.ts is the Express error middleware. It catches errors, sends a JSON response, and uses the right status code depending on the error type.
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if (err instanceof Error) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
    return;
  }

  //logger.error(err);
  res.status(500).json({
    success: false,
    message: "An unknown error occurred.",
  });
}
