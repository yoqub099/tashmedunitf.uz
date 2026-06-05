/**
 * @tmtu/auth — Auth helpers (Sanctum-compatible)
 *
 * TODO:
 *   - Extract apps/admin/src/store/useAuthStore.ts logic
 *   - Add role/permission guards (RBAC from backend Spatie permissions)
 *   - Token refresh logic
 *   - 2FA helpers (future)
 */

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  roles: string[];
  permissions: string[];
};

export type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
};

export const hasPermission = (user: User | null, permission: string): boolean => {
  if (!user) return false;
  return user.permissions.includes(permission);
};

export const hasRole = (user: User | null, role: string): boolean => {
  if (!user) return false;
  return user.roles.includes(role);
};

export const hasAnyRole = (user: User | null, ...roles: string[]): boolean => {
  if (!user) return false;
  return roles.some((r) => user.roles.includes(r));
};
