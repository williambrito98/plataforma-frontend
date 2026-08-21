import type { LucideIcon } from "lucide-react";

import type { NavAccess } from "@/features/auth/lib/check-access";

export type AdminLucideIcon =
  | "Building2"
  | "Container"
  | "FolderTree"
  | "ShieldCheck"
  | "Tags"
  | "UserCog"
  | "Users";

export type AdminNavItem = {
  label: string;
  href:
    | "/automacoes"
    | "/arquivos"
    | "/categorias"
    | "/empresas"
    | "/rbac"
    | "/usuarios";
  lucideIcon: AdminLucideIcon;
  access?: NavAccess;
};

export type AdminPageMeta = {
  title: string;
  lucideIcon: AdminLucideIcon;
};

export type AdminLucideIconMap = Record<AdminLucideIcon, LucideIcon>;
