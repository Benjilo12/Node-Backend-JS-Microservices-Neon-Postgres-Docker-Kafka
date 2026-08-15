import { getPool } from "shared";
import { User, UserRole } from "../types/auth.types";

//?communicate with the database to create a new user and return the created user object

//* Find a user by email in the database */
export async function findByEmail(email: string): Promise<User | null> {
  const result = await getPool().query<User>(
    `SELECT id, name, email, password_hash, role, created_at FROM users WHERE email = $1`,
    [email],
  );
  return result.rows[0] || null;
}
//* Create a new user in the database */
export async function createUser(input: {
  name: string;
  email: string;
  password_hash: string;
  role?: UserRole;
}): Promise<User> {
  const result = await getPool().query<User>(
    `INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, password_hash, role, created_at`,
    [input.name, input.email, input.password_hash, input.role ?? "USER"],
  );

  return result.rows[0];
}

//* Find a user by ID in the database */
export async function findById(id: string): Promise<User | null> {
  const result = await getPool().query<User>(
    `SELECT id, name, email, password_hash, role, created_at FROM users WHERE id = $1`,
    [id],
  );
  return result.rows[0] || null;
}
