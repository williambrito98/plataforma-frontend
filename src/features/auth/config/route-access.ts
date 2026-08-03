import { PermissionCodes } from "@/features/auth/constants/permissions";
import type { AccessRequirement } from "@/features/auth/lib/check-access";

export type RouteAccess = AccessRequirement | "rbac";

export const routeAccessByPath: Record<string, RouteAccess> = {
  "/automacoes": { permissions: [PermissionCodes.EXECUTIONS_READ] },
  "/automacoes/nova": { permissions: [PermissionCodes.AUTOMATIONS_CREATE] },
  "/arquivos": { permissions: [PermissionCodes.FILES_READ] },
  "/rbac": "rbac",
};

export function resolveRouteAccess(pathname: string): RouteAccess | undefined {
  const candidates = Object.entries(routeAccessByPath)
    .filter(([path]) => pathname === path || pathname.startsWith(`${path}/`))
    .sort(([pathA], [pathB]) => pathB.length - pathA.length);

  return candidates[0]?.[1];
}
