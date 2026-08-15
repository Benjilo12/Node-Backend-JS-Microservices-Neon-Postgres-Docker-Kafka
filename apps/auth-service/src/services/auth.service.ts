import { RegisterInput } from "../schemas/auth.schemas.js";
import { createUser } from "../repositories/user.repo.js";
import { findByEmail } from "../repositories/user.repo.js";
import bcrypt from "bcryptjs";
import { convertToPublicUser } from "../utils/auth.utils.js";
import { LoginInput } from "../schemas/auth.schemas.js";
import { AppError, signToken } from "shared";

import { findById } from "../repositories/user.repo.js";

//* Service function to handle user registration */
export async function register(input: RegisterInput) {
  const existing = await findByEmail(input.email);

  if (existing) {
    throw new Error("User with this email already exists");
  }

  const password_hash = await bcrypt.hash(input.password, 10);

  const user = await createUser({
    name: input.name,
    email: input.email,
    password_hash,
    role: "USER",
  });

  return convertToPublicUser(user);
}

//* Service function to handle user login */
export async function login(input: LoginInput) {
  const user = await findByEmail(input.email);

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const valid = await bcrypt.compare(input.password, user.password_hash);

  if (!valid) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = signToken({ userId: user.id, role: user.role });

  return { token, user: convertToPublicUser(user) };
}

//* Service function to get the authenticated user's information */
export async function getMe(userId: string) {
  const user = await findById(userId);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return convertToPublicUser(user);
}
