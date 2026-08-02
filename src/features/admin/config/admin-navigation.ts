import type {
  AdminNavItem,
  AdminPageMeta,
} from "@/features/admin/types/admin-navigation";

export const adminNavigation = [
  {
    label: "Automações",
    href: "/automacoes",
    icon: "container",
  },
  {
    label: "Arquivos",
    href: "/arquivos",
    icon: "folder-tree",
  },
] as const satisfies readonly AdminNavItem[];

export const adminPageMetaByHref: Record<AdminNavItem["href"], AdminPageMeta> =
  {
    "/automacoes": { title: "Automações", icon: "container" },
    "/arquivos": { title: "Arquivos", icon: "folder-tree" },
  };

export const adminSecondaryPageMeta = {
  "/automacoes/nova": { title: "Nova automação", icon: "container" },
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
