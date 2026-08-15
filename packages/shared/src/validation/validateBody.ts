import { ZodSchema } from "zod";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppErrors.js";

//* Middleware to validate request body against a Zod schema */
//*validateBody.ts defines a middleware function that validates the request body against a provided Zod schema.
export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const parsed = schema.safeDecode(req.body);

      if (!parsed.success) {
        const message = parsed.error.issues
          .map((issue) => issue.message)
          .join(", ");

        return next(new AppError(400, `Validation error: ${message}`));
      }

      req.body = parsed.data;
    }

    next();
  };
}
