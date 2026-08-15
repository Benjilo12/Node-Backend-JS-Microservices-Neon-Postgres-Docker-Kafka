import { UserRole } from "shared";

// A RBAC rule defines an HTTP route and the user roles
// that are permitted to access it.
export type RbacRule = {
  method: string;
  path: string;
  roles: UserRole[];
};

// Public routes do not require authentication or role checks.
export const publicRoutes = [
  {
    method: "POST",
    path: "/auth/register",
  },
  {
    method: "POST",
    path: `/auth/login`,
  },
] as const;

// Protected RBAC rules for the API gateway.
const rbacRules: RbacRule[] = [
  {
    method: "GET",
    path: "/auth/me",
    roles: ["USER", "ADMIN"],
  },
  {
    method: "POST",
    path: "/tasks",
    roles: ["USER", "ADMIN"],
  },
  {
    method: "GET",
    path: "/tasks",
    roles: ["USER", "ADMIN"],
  },
  {
    method: "GET",
    path: "/tasks/:id",
    roles: ["USER", "ADMIN"],
  },
  {
    method: "DELETE",
    path: "/tasks/:id",
    roles: ["ADMIN"],
  },
  {
    method: "POST",
    path: "/tasks/:taskId/attachment",
    roles: ["USER", "ADMIN"],
  },
  {
    method: "GET",
    path: "/tasks/:taskId/attachment",
    roles: ["USER", "ADMIN"],
  },
  {
    method: "GET",
    path: "/tasks/:taskId/workflows",
    roles: ["USER", "ADMIN"],
  },
];

// Compare a route pattern to an actual path.
// Supports simple parameter segments like /users/:id.
function matchPath(pattern: string, actual: string): boolean {
  if (pattern === actual) {
    return true;
  }

  const patternParts = pattern.split("/");
  const actualParts = actual.split("/");

  if (patternParts.length !== actualParts.length) {
    return false;
  }

  return patternParts.every(
    (part, index) => part.startsWith(":") || part === actualParts[index],
  );
}

// Determine whether the incoming request matches a public route.
export function isPublicRoute(method: string, path: string): boolean {
  return publicRoutes.some(
    (route) => route.method === method && matchPath(route.path, path),
  );
}

// Get the allowed roles for a protected route, or null when no rule matches.
export function getAllowedRoles(
  method: string,
  path: string,
): UserRole[] | null {
  const rule = rbacRules.find(
    (currentItem) =>
      currentItem.method === method && matchPath(currentItem.path, path),
  );
  return rule?.roles ?? null;
}
