// Import database connection pool from shared packages
import { getPool } from "shared";
// Import Workflow type definition
import { Workflow } from "../utils/type";

/**
 * Creates a new workflow record in the task_workflows table
 * This function inserts a workflow event associated with a task
 *
 * @param input - Object containing workflow creation parameters
 * @param input.taskId - The ID of the task this workflow is associated with
 * @param input.eventType - The type of workflow event (e.g., 'created', 'updated', 'completed')
 * @param input.message - Detailed message describing the workflow event
 * @param input.createdBy - User ID or identifier of who created this workflow event
 * @returns Promise<Workflow> - The newly created workflow record with all fields including id and created_at
 */
export async function createWorkflow(input: {
  taskId: string;
  eventType: string;
  message: string;
  createdBy: string;
}): Promise<Workflow> {
  // Execute INSERT query with parameterized values to prevent SQL injection
  const result = await getPool().query<Workflow>(
    `
        INSERT INTO task_workflows (task_id, event_type, message, created_by)
        VALUES ($1, $2, $3, $4)
        RETURNING id, task_id, event_type, message, created_by, created_at
        
        `,
    [input.taskId, input.eventType, input.message, input.createdBy],
  );

  // Return the first (and only) row from the result set
  return result.rows[0];
}

export async function listWorkflowsByTaskId(
  taskId: string,
): Promise<Workflow[]> {
  const result = await getPool().query<Workflow>(
    `
    SELECT id, task_id, event_type, message, created_by, created_at
    FROM task_workflows
    WHERE task_id = $1
    ORDER BY created_at DESC
    
    `,
    [taskId],
  );

  return result.rows;
}

export async function findTaskOwner(
  taskId: string,
): Promise<{ created_by: string } | null> {
  const result = await getPool().query<{ created_by: string }>(
    `
    SELECT created_by FROM tasks WHERE id = $1
    `,
    [taskId],
  );

  return result.rows[0] ?? null;
}
