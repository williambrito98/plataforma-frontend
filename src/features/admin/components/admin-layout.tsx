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
            {/* Abaixo de xl o header fica fixo no topo para o menu estar sempre ao alcance */}
            <header className="flex items-start px-6 pt-6.5 max-xl:sticky max-xl:top-0 max-xl:z-20 max-xl:border-b max-xl:border-border max-xl:bg-background/95 max-xl:py-2 max-xl:backdrop-blur max-md:px-4">
              <div className="flex items-center gap-6 w-full max-xl:gap-2">
                <AdminPanelToggle />
                <AdminPageHeader />
              </div>
            </header>

            {/* overflow-clip abaixo de xl: recorta sem criar contêiner de rolagem, permitindo barras sticky */}
            <main className="overflow-hidden px-6 pt-14.5 pb-6 max-xl:overflow-clip max-xl:pt-6 max-md:px-4">
              <AdminPageTransition />
            </main>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </RequireRouteAccess>
  );
}
