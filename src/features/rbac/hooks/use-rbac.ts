import { useSession } from "@/features/auth/hooks/use-session";

const ADMIN_ROLE = "Admin";
const RBAC_MANAGE_PERMISSION = "rbac.manage";

export function useRbac() {
  const { user, isLoading, isAuthenticated } = useSession();

  const permissions = user?.permissions ?? [];
  const isAdmin = user?.role?.name === ADMIN_ROLE;
  const hasPermission = (code: string) => permissions.includes(code);
  const hasAnyPermission = (codes: string[]) => codes.some(hasPermission);
  const hasAllPermissions = (codes: string[]) => codes.every(hasPermission);
  const canAccessRbac = isAdmin || hasPermission(RBAC_MANAGE_PERMISSION);

  return {
    user,
    isLoading,
    isAuthenticated,
    permissions,
    isAdmin,
    canAccessRbac,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}

export function canAccessRbacFromUser(
  user: {
    role?: { name: string };
    permissions?: string[];
  } | null,
): boolean {
  if (!user) {
    return false;
  }

  return (
    user.role?.name === ADMIN_ROLE ||
    (user.permissions?.includes(RBAC_MANAGE_PERMISSION) ?? false)
  );
}
