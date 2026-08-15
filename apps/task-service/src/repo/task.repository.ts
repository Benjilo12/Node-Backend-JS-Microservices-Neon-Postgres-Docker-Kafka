import { getPool } from "shared";
import { Task } from "../utils/types";

// Create a new task record for the given user.
// Uses a parameterized SQL INSERT to avoid SQL injection.
export async function createTask(input: {
  title: string;
  createdBy: string;
}): Promise<Task> {
  const result = await getPool().query<Task>(
    `INSERT INTO tasks(title, created_by)
    VALUES ($1, $2)
    RETURNING id, title, status, created_by, created_at, updated_at`,
    [input.title, input.createdBy],
  );

  return result.rows[0];
}

export async function listTasks(inputs: {
  userId: string;
  role: string;
}): Promise<Task[]> {
  // If the user is an admin, return all tasks with no user filter.
  if (inputs.role === "ADMIN") {
    const result = await getPool().query<Task>(
      `
    SELECT id, title, status, created_by, created_at, updated_at FROM tasks
    ORDER BY created_at DESC`,
    );
    return result.rows;
  }

  // For non-admin users, return only tasks created by that user.
  const result = await getPool().query<Task>(
    `
    SELECT id, title, status, created_by, created_at, updated_at FROM tasks
    WHERE created_by = $1
    ORDER BY created_at DESC`,
    [inputs.userId],
  );

  return result.rows;
}

//*fetch sigle task
export async function findSingleTaskById(id: string): Promise<Task | null> {
  const result = await getPool().query<Task>(
    `
    SELECT id, title, status, created_by, created_at, updated_at FROM tasks
    WHERE id = $1`,
    [id],
  );
  return result.rows[0] ?? null;
}

export async function deleteSingTaskById(id: string): Promise<boolean> {
  const result = await getPool().query(`DELETE FROM tasks WHERE id = $1`, [id]);
  return (result.rowCount ?? 0) > 0;
}
