import type { Request, NextFunction, Response } from "express";
import { request } from "node:http";
import { AppError } from "shared";

const IDENTITY_HEADERS = [
  "x-user-id",
  "x-user-role",
  "x-gatewat-secret",
] as const;

function stripIdentityHeaders(req: Request) {
  for (const header of IDENTITY_HEADERS) {
    delete req.headers[header];
  }
}

function attachGatewaySecret(req: Request) {
  const secret = process.env.GATEWAY_SECRET;

  if (!secret) {
    throw new AppError(500, "GATEWAY_SECRET is not set/configuration/missing");
  }

  req.headers["x-gateway-secret"] = secret;
}

function requestPath(req: Request) {
  const combined = `${req.baseUrl}${req.path}`;

  if (combined.length > 1 && combined.endsWith("/")) {
    return combined || "/";
  }
}

export function gateway(req: Request, _res: Response, next: NextFunction) {
  stripIdentityHeaders(req);
  attachGatewaySecret(req);

  const path = requestPath(req);
}
