import type { LucideIcon } from "lucide-react";

export type AdminLucideIcon =
  | "Container"
  | "FolderTree"
  | "ShieldCheck"
  | "UserCog";

export type AdminNavItem = {
  label: string;
  href: "/automacoes" | "/arquivos" | "/rbac";
  lucideIcon: AdminLucideIcon;
};

export type AdminPageMeta = {
  title: string;
  lucideIcon: AdminLucideIcon;
};

export type AdminLucideIconMap = Record<AdminLucideIcon, LucideIcon>;
