import type { UserRole } from "@/generated/client"

export type Permission =
  | "product:view"
  | "product:create"
  | "product:update"
  | "product:delete"
  | "product:duplicate"
  | "product:bulkUpdate"
  | "product:bulkDelete"
  | "collection:view"
  | "collection:manage"
  | "inventory:view"
  | "inventory:adjust"
  | "analytics:view"
  | "activityLog:view"
  | "role:manage"
  | "aiContent:generate"

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ADMIN: [
    "product:view",
    "product:create",
    "product:update",
    "product:delete",
    "product:duplicate",
    "product:bulkUpdate",
    "product:bulkDelete",
    "collection:view",
    "collection:manage",
    "inventory:view",
    "inventory:adjust",
    "analytics:view",
    "activityLog:view",
    "role:manage",
    "aiContent:generate",
  ],
  MANAGER: [
    "product:view",
    "product:create",
    "product:update",
    "product:duplicate",
    "product:bulkUpdate",
    "collection:view",
    "collection:manage",
    "inventory:view",
    "inventory:adjust",
    "analytics:view",
    "activityLog:view",
    "aiContent:generate",
  ],
  EDITOR: [
    "product:view",
    "product:create",
    "product:update",
    "product:duplicate",
    "collection:view",
    "inventory:view",
    "aiContent:generate",
  ],
  VIEWER: ["product:view", "collection:view", "analytics:view"],
}

export function hasPermission(
  role: UserRole | undefined,
  permission: Permission
): boolean {
  if (!role) return false
  return ROLE_PERMISSIONS[role]?.includes(permission) || false
}

/**
 * Check if a user role is authorized for a list of permissions
 */
export function can(
  role: UserRole | undefined,
  permissions: Permission | Permission[]
): boolean {
  if (!role) return false

  if (Array.isArray(permissions)) {
    return permissions.every((p) => hasPermission(role, p))
  }

  return hasPermission(role, permissions)
}

/**
 * Check if a user role has any of the listed permissions
 */
export function canAny(
  role: UserRole | undefined,
  permissions: Permission[]
): boolean {
  if (!role) return false
  return permissions.some((p) => hasPermission(role, p))
}
