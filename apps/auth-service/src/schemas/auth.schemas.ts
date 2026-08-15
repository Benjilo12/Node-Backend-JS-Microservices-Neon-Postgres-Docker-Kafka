import { z } from "zod";

//* Zod schemas for validating request bodies in the auth-service */
export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("valid email is required"),
  password: z
    .string()
    .min(6, "Password is required and must be at least 6 characters long"),
});

export const loginSchema = z.object({
  email: z.string().email("valid email is required"),
  password: z
    .string()
    .min(6, "Password is required and must be at least 6 characters long"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
