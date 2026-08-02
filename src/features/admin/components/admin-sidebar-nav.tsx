import { Link, useRouterState } from "@tanstack/react-router";
import { Cog, LogOut, Sun, User, UserCog } from "lucide-react";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { adminNavigation } from "@/features/admin/config/admin-navigation";
import { AdminIcon } from "@/features/admin/components/admin-icon";
import { mockSidebarUser } from "@/features/admin/data/mock-sidebar-user";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const sidebarUserMenuItems = [
  { label: "Configurações de conta", icon: Cog },
  { label: "Meu perfil", icon: UserCog, href: "/perfil" as const },
  { label: "Sair", icon: LogOut },
] as const;

const navButtonClassName =
  "h-10 gap-2 rounded-md px-4 py-2 text-sm leading-5 text-muted-foreground hover:bg-accent hover:text-muted-foreground group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-3 group-data-[collapsible=icon]:py-2.5";

const activeNavButtonClassName =
  "border border-muted-foreground bg-accent text-foreground hover:bg-accent hover:text-foreground";

export function AdminSidebarNav() {
  const { state } = useSidebar();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isMobile = useIsMobile();
  const isCollapsed = !isMobile && state === "collapsed";

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
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const isMobile = useIsMobile();
  const isCollapsed = !isMobile && state === "collapsed";
  const label = isDark ? "Modo claro" : "Modo escuro";

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <SidebarMenu className="gap-2.5 group-data-[collapsible=icon]:items-center">
      <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
        <SidebarMenuButton
          tooltip={isCollapsed ? label : undefined}
          className={cn(navButtonClassName, "cursor-pointer")}
          type="button"
          onClick={toggleTheme}
        >
          {isDark ? (
            <Sun className="size-4 shrink-0" aria-hidden />
          ) : (
            <AdminIcon name="moon" size={16} />
          )}
          {isCollapsed ? null : <span>{label}</span>}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function AdminSidebarUserMenu() {
  const { state } = useSidebar();
  const isMobile = useIsMobile();
  const isCollapsed = !isMobile && state === "collapsed";
  const user = mockSidebarUser;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className={cn(
              "group flex w-full cursor-pointer items-center rounded-md py-0.5 transition-colors",
              "hover:bg-accent data-popup-open:bg-accent",
              isCollapsed
                ? "justify-center p-0.5"
                : "justify-between pl-0.5 pr-3",
            )}
          />
        }
      >
        <div
          className={cn(
            "flex items-center",
            isCollapsed ? "gap-0" : "min-w-0 flex-1 gap-3",
          )}
        >
          <div className="flex size-10 shrink-0 overflow-hidden rounded-md bg-muted text-muted-foreground">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center">
                <User className="size-5" aria-hidden />
              </div>
            )}
          </div>
          {!isCollapsed ? (
            <div className="flex min-w-0 flex-col text-muted-foreground">
              <span className="truncate text-sm leading-5">{user.name}</span>
              <span className="truncate text-xs leading-4 font-bold">
                {user.subtitle}
              </span>
            </div>
          ) : null}
        </div>
        {!isCollapsed ? (
          <AdminIcon
            name="chevron-up"
            size={16}
            className="transition-transform duration-200 ease-in-out group-data-popup-open:rotate-180"
          />
        ) : null}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="top"
        align="start"
        className="mb-1 w-60 border-border"
      >
        {sidebarUserMenuItems.map(({ label, icon: Icon, ...item }) => (
          <DropdownMenuItem
            key={label}
            aria-label={label}
            className="cursor-pointer text-muted-foreground"
            render={
              "href" in item && item.href ? <Link to={item.href} /> : undefined
            }
            onClick={
              "href" in item && item.href
                ? undefined
                : (event) => event.preventDefault()
            }
          >
            <Icon aria-hidden />
            <span>{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
