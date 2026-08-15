import { config } from "dotenv";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { getPool, closePool } from "shared";

//* Load environment variables from the .env file */
config({ path: resolve(process.cwd(), ".env") });

//* Load environment variables from the .env file in the parent directory */
//*it will do the database migration to neon*/
async function main() {
  const file = process.argv[2] ?? "001_users.sql";
  const candidates = [
    resolve(process.cwd(), file),
    resolve(process.cwd(), "sql", file.replace(/^sql[\\/]/, "")),
  ];

  const sqlFilePath = candidates.find((candidate) => existsSync(candidate));

  if (!sqlFilePath) {
    throw new Error(`Migration file not found: ${file}`);
  }

  const sql = readFileSync(sqlFilePath, "utf-8");

  const pool = getPool();
  await pool.query(sql);
  console.log(`Executed migration: ${sqlFilePath}`);
  await closePool();
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
