import { User } from "../types/auth.types.js";

//* Convert a User object to a public representation without sensitive information */
export function convertToPublicUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
  };
}
