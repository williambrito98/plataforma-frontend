import { useSession } from "@/features/auth/hooks/use-session";
import { canAccessRbac, hasPermission } from "@/features/auth/lib/check-access";

export function useRbac() {
  const { user, isLoading, isAuthenticated } = useSession();

  const permissions = user?.permissions ?? [];
  const isAdmin = user?.role?.name === "Admin";
  const hasPermissionFn = (code: string) => hasPermission(user, code);
  const hasAnyPermission = (codes: string[]) =>
    codes.some((code) => hasPermissionFn(code));
  const hasAllPermissions = (codes: string[]) =>
    codes.every((code) => hasPermissionFn(code));
  const canAccessRbacView = canAccessRbac(user);

  return {
    user,
    isLoading,
    isAuthenticated,
    permissions,
    isAdmin,
    canAccessRbac: canAccessRbacView,
    hasPermission: hasPermissionFn,
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
  return canAccessRbac(user);
}
