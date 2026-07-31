export type AdminNavIcon = "container" | "folder-tree" | "settings-2" | "moon";

export type AdminNavItem = {
  label: string;
  href: "/automacoes" | "/arquivos" | "/ajustes";
  icon: AdminNavIcon;
};

export type AdminPageMeta = {
  title: string;
  icon: AdminNavIcon;
};
