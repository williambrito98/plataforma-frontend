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
  {
    label: "Ajustes",
    href: "/ajustes",
    icon: "settings-2",
  },
] as const satisfies readonly AdminNavItem[];

export const adminPageMetaByHref: Record<AdminNavItem["href"], AdminPageMeta> =
  {
    "/automacoes": { title: "Automações", icon: "container" },
    "/arquivos": { title: "Arquivos", icon: "folder-tree" },
    "/ajustes": { title: "Ajustes", icon: "settings-2" },
  };

export const adminSecondaryPageMeta = {
  "/perfil": { title: "Meu perfil", lucideIcon: "UserCog" },
} as const satisfies Record<string, AdminPageMeta>;

export function getAdminPageMeta(pathname: string): AdminPageMeta | null {
  const navMatch = adminNavigation.find((item) =>
    pathname.startsWith(item.href),
  );

  if (navMatch) {
    return adminPageMetaByHref[navMatch.href];
  }

  const secondaryMatch = Object.entries(adminSecondaryPageMeta).find(([href]) =>
    pathname.startsWith(href),
  );

  return secondaryMatch ? secondaryMatch[1] : null;
}
