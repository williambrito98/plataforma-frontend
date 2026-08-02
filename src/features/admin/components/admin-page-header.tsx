import { useRouterState } from "@tanstack/react-router";
import { UserCog } from "lucide-react";

import { getAdminPageMeta } from "@/features/admin/config/admin-navigation";
import { AdminIcon } from "@/features/admin/components/admin-icon";
import type { AdminLucideIconMap } from "@/features/admin/types/admin-navigation";
import { cn } from "@/lib/utils";

const lucideIconMap = {
  UserCog,
} satisfies AdminLucideIconMap;

type AdminPageHeaderProps = {
  className?: string;
};

export function AdminPageHeader({ className }: AdminPageHeaderProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const pageMeta = getAdminPageMeta(pathname);

  if (!pageMeta) {
    return null;
  }

  const LucideIcon = pageMeta.lucideIcon
    ? lucideIconMap[pageMeta.lucideIcon]
    : null;

  return (
    <div className={cn("flex items-center gap-2 px-4 py-2", className)}>
      {LucideIcon ? (
        <LucideIcon className="size-5 shrink-0" aria-hidden />
      ) : pageMeta.icon ? (
        <AdminIcon name={pageMeta.icon} size={20} />
      ) : null}
      <h1 className="truncate text-lg leading-7 font-bold text-foreground">
        {pageMeta.title}
      </h1>
    </div>
  );
}
