import { Outlet } from "@tanstack/react-router";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminPanelToggle } from "@/features/admin/components/admin-panel-toggle";
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";
import { RequireRouteAccess } from "@/features/auth/components/require-route-access";

export function AdminLayout() {
  return (
    <RequireRouteAccess>
      <TooltipProvider delay={0}>
        <SidebarProvider defaultOpen>
          <AdminSidebar />
          <SidebarInset className="min-h-svh bg-background">
            <header className="flex items-start px-6 pt-6.5">
              <div className="flex items-center gap-6">
                <AdminPanelToggle />
                <AdminPageHeader />
              </div>
            </header>

            <main className="px-6 pt-14.5 pb-6">
              <Outlet />
            </main>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </RequireRouteAccess>
  );
}
