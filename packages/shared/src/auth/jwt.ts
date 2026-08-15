import * as jwt from "jsonwebtoken";
import type { JwtPayload } from "./types.js";

//* Get the JWT signing secret from environment variables.
//* This ensures token operations fail fast when configuration is missing.
function extractjwtSecret(): string {
  const Secret = process.env.JWT_SECRET;
  if (!Secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  return Secret;
}

//* Sign a JWT payload with the application secret and optional expiry.
// The returned token is safe to store on the client and verify later.
export function signToken(payload: JwtPayload): string {
  const expiresIn = process.env.JWT_EXPIRES_IN;
  return jwt.sign(payload, extractjwtSecret(), {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
  });
}

//* Verify a JWT string and validate its payload shape.
// Throws if the token is invalid, expired, or the payload is malformed.
export function verifyToken(token: string): JwtPayload {
  const decodeToken = jwt.verify(token, extractjwtSecret());

  if (
    typeof decodeToken !== "object" ||
    decodeToken === null ||
    typeof decodeToken.userId !== "string" ||
    (decodeToken.role !== "USER" && decodeToken.role !== "ADMIN")
  ) {
    throw new Error("Invalid token payload");
  }

  return {
    userId: decodeToken.userId,
    role: decodeToken.role,
  };
}
