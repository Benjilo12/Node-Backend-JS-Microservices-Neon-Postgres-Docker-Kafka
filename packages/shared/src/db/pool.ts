import { Pool } from "pg";

let pool: Pool | null = null;

//* This function returns a singleton instance of the PostgreSQL connection pool.
export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set.");
    }
    pool = new Pool({
      connectionString,
    });
  }
  return pool;
}

//* This function closes the PostgreSQL connection pool if it exists.
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
