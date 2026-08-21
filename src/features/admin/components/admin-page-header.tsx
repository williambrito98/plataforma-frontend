import { useRouterState } from "@tanstack/react-router";

import { AdminLucideIcon } from "@/features/admin/config/admin-lucide-icons";
import { getAdminPageMeta } from "@/features/admin/config/admin-navigation";
import { CompanySwitcher } from "@/features/companies/components/company-switcher";
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
        "flex w-full items-center justify-between gap-4 px-4 py-2",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <AdminLucideIcon
          name={pageMeta.lucideIcon}
          className="size-5 shrink-0"
        />
        <h1 className="truncate text-lg leading-7 font-bold text-foreground">
          {pageMeta.title}
        </h1>
      </div>
      <CompanySwitcher className="shrink-0" />
    </div>
  );
}
