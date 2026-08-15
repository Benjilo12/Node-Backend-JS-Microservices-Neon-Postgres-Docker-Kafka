export type UserRole = "USER" | "ADMIN";

//* User type definition */
export type User = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
};

//* Public representation of a User without sensitive information */
export type JwtPayload = {
  id: string;
  role: UserRole;
};
