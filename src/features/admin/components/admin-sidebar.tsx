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
import { AdminIcon } from "@/features/admin/components/admin-icon";

export function AdminSidebar() {
  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="px-6 pt-9.5 pb-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-3.5 group-data-[collapsible=icon]:pt-9.5">
        <div className="flex h-9 w-10.75 items-center justify-center group-data-[collapsible=icon]:w-auto">
          <AdminIcon name="logo" size={36} className="h-9 w-10.75" />
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
