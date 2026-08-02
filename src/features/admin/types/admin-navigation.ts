import type { LucideIcon } from "lucide-react";

export type AdminNavIcon = "container" | "folder-tree" | "moon";

export type AdminLucideIcon = "UserCog";

export type AdminNavItem = {
  label: string;
  href: "/automacoes" | "/arquivos";
  icon: AdminNavIcon;
};

export type AdminPageMeta = {
  title: string;
  icon?: AdminNavIcon;
  lucideIcon?: AdminLucideIcon;
};

export type AdminLucideIconMap = Record<AdminLucideIcon, LucideIcon>;
