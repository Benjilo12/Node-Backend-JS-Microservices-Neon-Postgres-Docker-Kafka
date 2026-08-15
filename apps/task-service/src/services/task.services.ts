import { CreateTaskInput } from "./../schemas/task.schemas";
import * as taskRepo from "../repo/task.repository";
import { convertToPublicTask } from "../utils/task.utils";
import { AppError } from "shared";
import { publishTaskEvent } from "../kafka";

/**
 * Creates a new task with the provided input
 * @param input - Task creation input containing title and other details
 * @param userId - ID of the user creating the task
 * @returns The newly created task converted to public format
 */
export async function CreateTask(input: CreateTaskInput, userId: string) {
  const newlyCreatedTask = await taskRepo.createTask({
    title: input.title,
    createdBy: userId,
  });

  await publishTaskEvent(newlyCreatedTask.id, userId);
  return convertToPublicTask(newlyCreatedTask);
}

/**
 * Retrieves all tasks visible to the user based on their role
 * @param userId - ID of the user requesting the tasks
 * @param role - Role of the user (used for permission checking)
 * @returns Array of tasks converted to public format
 * @throws AppError - If userId or role is missing
 */
export async function listTasks(userId: string, role: string) {
  if (!userId || !role) {
    throw new AppError(401, "Missing user identity");
  }

  const tasks = await taskRepo.listTasks({ userId, role });

  return tasks.map(convertToPublicTask);
}

/**
 * Retrieves a single task by ID with permission checks
 * @param id - ID of the task to retrieve
 * @param userId - ID of the user requesting the task
 * @param role - Role of the user (ADMIN has access to all tasks)
 * @returns The task converted to public format
 * @throws AppError - If task not found (404) or user is not authorized (403)
 */
export async function getSingleTask(id: string, userId: string, role: string) {
  const task = await taskRepo.findSingleTaskById(id);

  if (!task) {
    throw new AppError(404, "Task not found");
  }

  if (role !== "ADMIN" && task.created_by !== userId) {
    throw new AppError(403, "forbidden");
  }

  return convertToPublicTask(task);
}

/**
 * Deletes a task by ID without permission checks
 * @param id - ID of the task to delete
 * @returns Object containing the deleted task ID
 */
export async function deleteSingTaskById(id: string) {
  await taskRepo.deleteSingTaskById(id);
  return { id };
}

/**
 * Deletes a task by ID with ADMIN role authorization check
 * @param id - ID of the task to delete
 * @param role - Role of the user requesting deletion (must be ADMIN)
 * @returns Object containing the deleted task ID
 * @throws AppError - If user is not ADMIN (403) or task not found (404)
 */
export async function deleteSingleTask(id: string, role: string) {
  if (role !== "ADMIN") {
    throw new AppError(403, "Forbidden");
  }

  const task = await taskRepo.findSingleTaskById(id);
  if (!task) {
    throw new AppError(404, "Task not found");
  }

  await taskRepo.deleteSingTaskById(id);
  return { id };
}
