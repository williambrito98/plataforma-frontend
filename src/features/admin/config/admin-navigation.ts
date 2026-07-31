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

export function getAdminPageMeta(pathname: string): AdminPageMeta | null {
  const match = adminNavigation.find((item) => pathname.startsWith(item.href));
  return match ? adminPageMetaByHref[match.href] : null;
}
