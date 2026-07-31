import { Link, useRouterState } from "@tanstack/react-router";
import { User } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { adminNavigation } from "@/features/admin/config/admin-navigation";
import { AdminIcon } from "@/features/admin/components/admin-icon";
import { cn } from "@/lib/utils";

const navButtonClassName =
  "h-10 gap-2 rounded-md px-4 py-2 text-sm leading-5 text-[#737373] hover:bg-accent hover:text-[#737373] group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-3 group-data-[collapsible=icon]:py-2.5";

const activeNavButtonClassName =
  "border border-[#A3A3A3] bg-accent text-[#404040] hover:bg-accent hover:text-[#404040]";

export function AdminSidebarNav() {
  const { state } = useSidebar();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isCollapsed = state === "collapsed";

  return (
    <SidebarMenu className="gap-2.5 group-data-[collapsible=icon]:items-center">
      {adminNavigation.map((item) => {
        const isActive = pathname === item.href;

        return (
          <SidebarMenuItem
            key={item.href}
            className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center"
          >
            <SidebarMenuButton
              isActive={isActive}
              tooltip={isCollapsed ? item.label : undefined}
              className={cn(
                navButtonClassName,
                isActive && activeNavButtonClassName,
              )}
              render={<Link to={item.href} />}
            >
              <AdminIcon name={item.icon} size={16} />
              {isCollapsed ? null : <span>{item.label}</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

export function AdminSidebarDarkModeItem() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarMenu className="gap-2.5 group-data-[collapsible=icon]:items-center">
      <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
        <SidebarMenuButton
          tooltip={isCollapsed ? "Modo escuro" : undefined}
          className={cn(navButtonClassName, "cursor-default")}
          type="button"
        >
          <AdminIcon name="moon" size={16} />
          {isCollapsed ? null : <span>Modo escuro</span>}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function AdminSidebarUserMenu() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div
      className={cn(
        "flex w-full items-center rounded-md py-0.5",
        isCollapsed ? "justify-center p-0.5" : "justify-between pl-0.5 pr-3",
      )}
    >
      <div className="flex items-center gap-3 group-data-[collapsible=icon]:gap-0">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-[#737373]">
          <User className="size-5" aria-hidden />
        </div>
        {!isCollapsed ? (
          <div className="flex min-w-0 flex-col justify-center text-[#737373]">
            <span className="truncate text-sm leading-5">Marcelo Cardoso</span>
            <span className="truncate text-xs leading-4 font-bold">WIMPRA</span>
          </div>
        ) : null}
      </div>
      {!isCollapsed ? <AdminIcon name="chevron-up" size={16} /> : null}
    </div>
  );
}
