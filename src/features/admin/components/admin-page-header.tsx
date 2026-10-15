import { useRouterState } from "@tanstack/react-router";

import { AdminLucideIcon } from "@/features/admin/config/admin-lucide-icons";
import { getAdminPageMeta } from "@/features/admin/config/admin-navigation";
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
    <div
      className={cn(
        "flex w-full min-w-0 items-center justify-start gap-4 px-4 py-2 max-xl:gap-3 max-xl:px-2",
        className,
      )}
    >
      <AdminLucideIcon name={pageMeta.lucideIcon} className="size-5 shrink-0" />
      <h1 className="truncate text-lg leading-7 font-bold text-foreground">
        {pageMeta.title}
      </h1>
    </div>
  );
}
