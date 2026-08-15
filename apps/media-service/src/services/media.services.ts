import { AppError } from "shared";
import * as attachmentRepo from "../repositories/media.repositories";

import { convertToPublicMediaAttachment } from "../utils/media.utils";
import { publishAttachmentEvent } from "../kafka";
import { uploadBuffer } from "../utils/storage";

/**
 * Verify that a user (or admin) has access to the given task.
 * Throws an `AppError(404)` when the task doesn't exist and
 * `AppError(403)` when the user is not allowed to access the task.
 */
async function assertTaskAccess(taskId: string, userId: string, role: string) {
  const task = await attachmentRepo.findTaskAccess(taskId);

  if (!task) {
    throw new AppError(404, "Task not found");
  }

  // Only allow non-admin users if they created the task.
  if (role !== "ADMIN" && task.created_by !== userId) {
    throw new AppError(403, "Forbidden");
  }
}

/**
 * Upload an attachment for a task.
 * Steps:
 * - Validate presence of file
 * - Ensure the caller has access to the task
 * - Upload the file buffer to storage
 * - Create a DB record for the attachment
 * - Publish an attachment-created event
 * - Return the public-facing attachment shape
 */
export async function uploadAttachment(input: {
  taskId: string;
  userId: string;
  role: string;
  file?: Express.Multer.File;
}) {
  if (!input.file) {
    throw new AppError(400, "Image file is required");
  }

  // Confirm the caller is allowed to upload for this task.
  await assertTaskAccess(input.taskId, input.userId, input.role);

  // Upload binary buffer to the storage provider and get public URLs/ids.
  const uploaded = await uploadBuffer(
    input.file.buffer,
    input.file.mimetype || "image/jpeg",
  );

  // Persist attachment row in the database.
  const attachment = await attachmentRepo.createAttachment({
    taskId: input.taskId,
    imageUrl: uploaded.imageUrl,
    publicId: uploaded.publicId,
    uploadedBy: input.userId,
  });

  // Notify other services that a new attachment exists.
  await publishAttachmentEvent(input.taskId, input.userId);

  return convertToPublicMediaAttachment(attachment);
}

/**
 * List attachments for a task (access-checked).
 * Returns attachments in public shape suitable for API responses.
 */
export async function listAttachments(
  taskId: string,
  userId: string,
  role: string,
) {
  await assertTaskAccess(taskId, userId, role);
  const rows = await attachmentRepo.listByTaskId(taskId);

  return rows.map(convertToPublicMediaAttachment);
}
