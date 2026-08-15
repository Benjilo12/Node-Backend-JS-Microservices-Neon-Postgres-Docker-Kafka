import type { Request, NextFunction, Response } from "express";
import { AppError } from "../errors/AppErrors.js";

//* Protect routes by requiring a shared gateway secret header.
//* This middleware is intended for service-to-service authentication
//* between API gateway and backend microservices.
export function requireGatewaySecret(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const expected = process.env.GATEWAY_SECRET;

  if (!expected) {
    return next(new AppError(500, "GATEWAY_SECRET is not configured"));
  }

  const incoming = req.header("x-gateway-secret");

  if (!incoming || incoming !== expected) {
    return next(new AppError(403, "forbidden"));
  }

  next();
}
