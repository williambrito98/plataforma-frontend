import { useRouterState } from "@tanstack/react-router";

import { getAdminPageMeta } from "@/features/admin/config/admin-navigation";
import { AdminIcon } from "@/features/admin/components/admin-icon";
import { cn } from "@/lib/utils";

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

  return (
    <div className={cn("flex items-center gap-2 px-4 py-2", className)}>
      <AdminIcon name={pageMeta.icon} size={20} />
      <h1 className="truncate text-lg leading-7 font-bold text-foreground">
        {pageMeta.title}
      </h1>
    </div>
  );
}
