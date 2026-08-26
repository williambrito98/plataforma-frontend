import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  AdminSidebarDarkModeItem,
  AdminSidebarNav,
  AdminSidebarUserMenu,
} from "@/features/admin/components/admin-sidebar-nav";
import { BrandLogo } from "@/features/companies/components/brand-logo";
import { CompanySwitcher } from "@/features/companies/components/company-switcher";

export function AdminSidebar() {
  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="px-6 pt-9.5 pb-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-3.5 group-data-[collapsible=icon]:pt-9.5">
        <div className="flex min-w-0 items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <BrandLogo />
          <CompanySwitcher
            showLogo={false}
            className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="flex flex-col justify-between gap-9.5 px-6 pt-9.5 pb-6 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-3.5">
        <AdminSidebarNav />
        <AdminSidebarDarkModeItem />
      </SidebarContent>

      <SidebarFooter className="px-6 pb-6 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-3.5">
        <AdminSidebarUserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
