import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminPageTransition } from "@/features/admin/components/admin-page-transition";
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
              <div className="flex items-center gap-6 w-full">
                <AdminPanelToggle />
                <AdminPageHeader />
              </div>
            </header>

            <main className="overflow-hidden px-6 pt-14.5 pb-6">
              <AdminPageTransition />
            </main>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </RequireRouteAccess>
  );
}
