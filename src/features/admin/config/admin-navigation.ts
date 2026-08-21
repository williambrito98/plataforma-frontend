import type {
  AdminNavItem,
  AdminPageMeta,
} from "@/features/admin/types/admin-navigation";
import { PermissionCodes } from "@/features/auth/constants/permissions";

export const adminNavigation = [
  {
    label: "Automações",
    href: "/automacoes",
    lucideIcon: "Container",
    access: { permissions: [PermissionCodes.EXECUTIONS_READ] },
  },
  {
    label: "Arquivos",
    href: "/arquivos",
    lucideIcon: "FolderTree",
    access: { permissions: [PermissionCodes.FILES_READ] },
  },
  {
    label: "Categorias",
    href: "/categorias",
    lucideIcon: "Tags",
    access: { permissions: [PermissionCodes.CATEGORIES_READ] },
  },
  {
    label: "Empresas",
    href: "/empresas",
    lucideIcon: "Building2",
    access: { permissions: [PermissionCodes.COMPANIES_CREATE] },
  },
  {
    label: "Usuários",
    href: "/usuarios",
    lucideIcon: "Users",
    access: { permissions: [PermissionCodes.USER_CONTROL] },
  },
  {
    label: "RBAC",
    href: "/rbac",
    lucideIcon: "ShieldCheck",
    access: "rbac",
  },
] as AdminNavItem[];

export const adminPageMetaByHref: Record<AdminNavItem["href"], AdminPageMeta> =
  {
    "/automacoes": { title: "Automações", lucideIcon: "Container" },
    "/arquivos": { title: "Arquivos", lucideIcon: "FolderTree" },
    "/categorias": { title: "Categorias", lucideIcon: "Tags" },
    "/empresas": { title: "Empresas", lucideIcon: "Building2" },
    "/usuarios": { title: "Usuários", lucideIcon: "Users" },
    "/rbac": { title: "RBAC", lucideIcon: "ShieldCheck" },
  };

export const adminSecondaryPageMeta = {
  "/automacoes/nova": { title: "Nova automação", lucideIcon: "Container" },
  "/perfil": { title: "Meu perfil", lucideIcon: "UserCog" },
} as const satisfies Record<string, AdminPageMeta>;

export function getAdminPageMeta(pathname: string): AdminPageMeta | null {
  const candidates: Array<{ href: string; meta: AdminPageMeta }> = [];

  for (const item of adminNavigation) {
    if (pathname.startsWith(item.href)) {
      candidates.push({
        href: item.href,
        meta: adminPageMetaByHref[item.href],
      });
    }
  }

  for (const [href, meta] of Object.entries(adminSecondaryPageMeta)) {
    if (pathname.startsWith(href)) {
      candidates.push({ href, meta });
    }
  }

  if (candidates.length === 0) {
    return null;
  }

  return candidates.sort((a, b) => b.href.length - a.href.length)[0].meta;
}
