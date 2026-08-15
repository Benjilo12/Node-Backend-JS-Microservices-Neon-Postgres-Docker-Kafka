import type { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service.js";
import { AppError, successResponse } from "shared";

//* Controller function to handle user registration */
export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Implementation for register function
  try {
    // Call the service function to register the user
    const user = await authService.register(req.body);
    successResponse(res, { user }, 201);
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  // Implementation for login function
  try {
    const result = await authService.login(req.body);
    successResponse(res, result);
  } catch (error) {
    next(error);
  }
}

//* Controller function to get the authenticated user's information */
export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      throw new AppError(401, "Unauthorized: User ID not found in headers");
    }

    const user = await authService.getMe(userId);
    successResponse(res, { user });
  } catch (error) {
    next(error);
  }
}
