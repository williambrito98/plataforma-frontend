import type { LucideIcon } from "lucide-react";

import type { NavAccess } from "@/features/auth/lib/check-access";

export type AdminLucideIcon =
  | "Container"
  | "FolderTree"
  | "ShieldCheck"
  | "UserCog";

export type AdminNavItem = {
  label: string;
  href: "/automacoes" | "/arquivos" | "/rbac";
  lucideIcon: AdminLucideIcon;
  access?: NavAccess;
};

export type AdminPageMeta = {
  title: string;
  lucideIcon: AdminLucideIcon;
};

export type AdminLucideIconMap = Record<AdminLucideIcon, LucideIcon>;
