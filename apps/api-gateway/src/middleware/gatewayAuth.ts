import type { Request, NextFunction, Response } from "express";
import { request } from "node:http";
import { AppError, verifyToken } from "shared";
import { getAllowedRoles, isPublicRoute } from "../rbac.js";

// Headers that should never be forwarded from an incoming client request.
// These can be injected or controlled by the gateway itself.
const IDENTITY_HEADERS = [
  "x-user-id",
  "x-user-role",
  "x-gateway-secret",
] as const;

// Remove any client-supplied identity or gateway-specific headers.
function stripIdentityHeaders(req: Request) {
  for (const header of IDENTITY_HEADERS) {
    delete req.headers[header];
  }
}

// Ensure the gateway secret is attached to the request before proxying.
// This secret is used by downstream services to verify the request came from the gateway.
function attachGatewaySecret(req: Request) {
  const secret = process.env.GATEWAY_SECRET;

  if (!secret) {
    throw new AppError(500, "GATEWAY_SECRET is not set/configuration/missing");
  }

  req.headers["x-gateway-secret"] = secret;
}

// Normalize the request path for routing and RBAC matching.
// The combined baseUrl and path are used for sub-route handling.
function requestPath(req: Request) {
  const combined = `${req.baseUrl}${req.path}`;

  if (combined.length > 1 && combined.endsWith("/")) {
    return combined.slice(0, -1);
  }

  return combined || "/";
}

function attachUserHeaders(req: Request, userId: string, role: string) {
  req.headers["x-user-id"] = userId;
  req.headers["x-user-role"] = role;
}

// Main gateway middleware that sanitizes headers and attaches the gateway secret.
export function gatewayAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    stripIdentityHeaders(req);
    attachGatewaySecret(req);

    const path = requestPath(req);

    if (isPublicRoute(req.method, path)) {
      return next();
    }

    const authHeader = req.header("authorization");

    if (!authHeader?.startsWith("Bearer")) {
      throw new AppError(401, "Missing or invalid auth token");
    }

    const token = authHeader.slice("Bearer".length).trim();
    const payload = verifyToken(token);

    // RBAC ->
    const allowedRotes = getAllowedRoles(req.method, path);

    if (!allowedRotes) {
      throw new AppError(404, "Route not found");
    }

    if (!allowedRotes.includes(payload.role)) {
      throw new AppError(
        403,
        "Forbidden, you do not have access to this route",
      );
    }

    attachUserHeaders(req, payload.userId, payload.role);
    next();
  } catch (err) {
    if (err instanceof AppError) {
      return next(err);
    }
    return next(new AppError(401, "Invalid of expired token"));
  }
}
