import { Attachment } from "./../utils/types";
import type { Request, Response, NextFunction } from "express";
import { AppError, successResponse } from "shared";
import * as attachmentService from "../services/media.services";

function requiredIdentity(req: Request) {
  const userId = req.headers["x-user-id"] as string | undefined;
  const role = req.headers["x-user-role"] as string | undefined;

  if (!role || !userId) {
    throw new AppError(401, "Missing user identity");
  }

  return { userId, role };
}

export async function uploadAttachment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId, role } = requiredIdentity(req);
    const taskId = String(req.params.taskId);
    const attachment = await attachmentService.uploadAttachment({
      taskId,
      userId,
      role,
      file: req.file,
    });

    successResponse(res, { attachment }, 201);
  } catch (err) {
    next(err);
  }
}

/**
 * List all attachments associated with a task.
 * Requires identity headers and authorization before fetching attachments.
 */
export async function listAttachments(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId, role } = requiredIdentity(req);
    const taskId = String(req.params.taskId);
    const extractAttachments = await attachmentService.listAttachments(
      taskId,
      userId,
      role,
    );
    successResponse(res, { extractAttachments });
  } catch (err) {
    next(err);
  }
}
