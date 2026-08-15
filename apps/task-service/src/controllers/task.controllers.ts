import type { NextFunction, Response, Request } from "express";
import * as taskService from "../services/task.services";
import { AppError, successResponse } from "shared";

function requiredIdentity(req: Request) {
  const userId = req.header("x-user-id");
  const role = req.header("x-user-role");

  if (!role || !userId) {
    throw new AppError(401, "Missing user identity");
  }

  return { userId, role };
}

export async function createTask(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = requiredIdentity(req);
    const task = await taskService.CreateTask(req.body, userId);
    successResponse(res, { task }, 201);
  } catch (err) {
    next(err);
  }
}

export async function listTasks(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId, role } = requiredIdentity(req);
    const tasks = await taskService.listTasks(userId, role);

    successResponse(res, { tasks });
  } catch (error) {
    next(error);
  }
}

export async function getSingleTasks(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId, role } = requiredIdentity(req);
    const id = String(req.params.id);

    const task = await taskService.getSingleTask(id, userId, role);

    successResponse(res, { task });
  } catch (error) {
    next(error);
  }
}
export async function deleteSingleTasks(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { role } = requiredIdentity(req);
    const id = String(req.params.id);
    const deletedResult = await taskService.deleteSingleTask(id, role);

    successResponse(res, { deletedResult });
  } catch (error) {
    next(error);
  }
}
