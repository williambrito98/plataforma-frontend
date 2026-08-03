import type { AdminNavItem } from "@/features/admin/types/admin-navigation";
import {
  ADMIN_ROLE,
  PermissionCodes,
  type PermissionCode,
} from "@/features/auth/constants/permissions";

export type AccessUser = {
  role?: { name: string };
  permissions?: string[];
} | null;

export type AccessRequirement = {
  permissions?: PermissionCode[];
  roles?: string[];
  requireAllPermissions?: boolean;
};

export type NavAccess = AccessRequirement | "rbac";

export function hasPermission(
  user: AccessUser,
  permission: PermissionCode | string,
): boolean {
  return user?.permissions?.includes(permission) ?? false;
}

export function canAccessRbac(user: AccessUser): boolean {
  if (!user) {
    return false;
  }

  return (
    user.role?.name === ADMIN_ROLE ||
    hasPermission(user, PermissionCodes.RBAC_MANAGE)
  );
}

export function checkAccess(
  user: AccessUser,
  requirement?: AccessRequirement,
): boolean {
  if (!requirement) {
    return true;
  }

  const {
    permissions = [],
    roles = [],
    requireAllPermissions = true,
  } = requirement;

  const hasRoles =
    roles.length === 0 || roles.some((role) => user?.role?.name === role);

  const userPermissions = user?.permissions ?? [];
  const hasPermissions =
    permissions.length === 0 ||
    (requireAllPermissions
      ? permissions.every((permission) => userPermissions.includes(permission))
      : permissions.some((permission) => userPermissions.includes(permission)));

  return hasRoles && hasPermissions;
}

export function checkNavAccess(user: AccessUser, access?: NavAccess): boolean {
  if (!access) {
    return true;
  }

  if (access === "rbac") {
    return canAccessRbac(user);
  }

  return checkAccess(user, access);
}

export function getFirstAccessibleRoute(
  user: AccessUser,
  nav: AdminNavItem[],
): AdminNavItem["href"] {
  const accessibleItem = nav.find((item) => checkNavAccess(user, item.access));

  return accessibleItem?.href ?? "/automacoes";
}
