import { PermissionCodes } from "@/features/auth/constants/permissions";
import type { AccessRequirement } from "@/features/auth/lib/check-access";

export type RouteAccess = AccessRequirement | "rbac";

export const routeAccessByPath: Record<string, RouteAccess> = {
  "/automacoes": { permissions: [PermissionCodes.EXECUTIONS_READ] },
  "/automacoes/nova": { permissions: [PermissionCodes.AUTOMATIONS_CREATE] },
  "/arquivos": { permissions: [PermissionCodes.FILES_READ] },
  "/categorias": { permissions: [PermissionCodes.CATEGORIES_READ] },
  "/empresas": { permissions: [PermissionCodes.COMPANIES_READ] },
  "/empresas/nova": { permissions: [PermissionCodes.COMPANIES_CREATE] },
  "/usuarios": { permissions: [PermissionCodes.USER_CONTROL] },
  "/rbac": "rbac",
};

const editCompanyRoutePattern = /^\/empresas\/\d+\/editar\/?$/;
const editAutomationRoutePattern = /^\/automacoes\/\d+\/editar\/?$/;

export function resolveRouteAccess(pathname: string): RouteAccess | undefined {
  if (editCompanyRoutePattern.test(pathname)) {
    return { permissions: [PermissionCodes.COMPANIES_UPDATE] };
  }

  if (editAutomationRoutePattern.test(pathname)) {
    return { permissions: [PermissionCodes.AUTOMATIONS_UPDATE] };
  }

  const candidates = Object.entries(routeAccessByPath)
    .filter(([path]) => pathname === path || pathname.startsWith(`${path}/`))
    .sort(([pathA], [pathB]) => pathB.length - pathA.length);

  return candidates[0]?.[1];
}
