import {
  Container,
  FolderTree,
  ShieldCheck,
  Tags,
  UserCog,
  Users,
} from "lucide-react";

import type {
  AdminLucideIcon,
  AdminLucideIconMap,
} from "@/features/admin/types/admin-navigation";
import { cn } from "@/lib/utils";

export const adminLucideIconMap = {
  Container,
  FolderTree,
  ShieldCheck,
  Tags,
  UserCog,
  Users,
} satisfies AdminLucideIconMap;

type AdminLucideIconProps = {
  name: AdminLucideIcon;
  className?: string;
};

export function AdminLucideIcon({ name, className }: AdminLucideIconProps) {
  const Icon = adminLucideIconMap[name];

  return <Icon className={cn("shrink-0", className)} aria-hidden />;
}
