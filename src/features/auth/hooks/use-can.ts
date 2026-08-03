import type { PermissionCode } from "@/features/auth/constants/permissions";
import { useSession } from "@/features/auth/hooks/use-session";

export function useCan(permission: PermissionCode | string): boolean {
  const { user, isLoading } = useSession();

  if (isLoading || !user) {
    return false;
  }

  return user.permissions?.includes(permission) ?? false;
}
