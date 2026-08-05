import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronUp, LogOut, Moon, Sun, User, UserCog } from "lucide-react";
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
import { AdminLucideIcon } from "@/features/admin/config/admin-lucide-icons";
import { adminNavigation } from "@/features/admin/config/admin-navigation";
import { checkNavAccess } from "@/features/auth/lib/check-access";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useSession } from "@/features/auth/hooks/use-session";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const sidebarUserMenuItems = [
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
  const { user, isLoading } = useSession();

  const visibleNavigation = isLoading
    ? []
    : adminNavigation.filter((item) => checkNavAccess(user, item.access));

  return (
    <SidebarMenu className="gap-2.5 group-data-[collapsible=icon]:items-center">
      {visibleNavigation.map((item) => {
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
              render={<Link to={item.href} preload="render" />}
            >
              <AdminLucideIcon
                name={item.lucideIcon}
                className="size-4 shrink-0"
              />
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
            <Moon className="size-4 shrink-0" aria-hidden />
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
  const { user } = useSession();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const displayName = user?.name ?? "Usuário";
  const subtitle = user?.role?.name ?? user?.email ?? "";
  const avatar = user?.avatar ?? undefined;

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
            {avatar ? (
              <img
                src={avatar}
                alt={displayName}
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
              <span className="truncate text-sm leading-5">{displayName}</span>
              <span className="truncate text-xs text-left leading-4 font-bold">
                {subtitle}
              </span>
            </div>
          ) : null}
        </div>
        {!isCollapsed ? (
          <ChevronUp
            className="size-4 shrink-0 transition-transform duration-200 ease-in-out group-data-popup-open:rotate-180"
            aria-hidden
          />
        ) : null}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="top"
        align="start"
        className="mb-1 w-60 border-border"
      >
        {sidebarUserMenuItems.map(({ label, icon: Icon, ...item }) => {
          const isLogout = label === "Sair";

          return (
            <DropdownMenuItem
              key={label}
              aria-label={label}
              className="cursor-pointer text-muted-foreground"
              disabled={isLogout && isLoggingOut}
              render={
                "href" in item && item.href ? (
                  <Link to={item.href} />
                ) : undefined
              }
              onClick={(event) => {
                if ("href" in item && item.href) {
                  return;
                }

                event.preventDefault();

                if (isLogout) {
                  logout();
                }
              }}
            >
              <Icon aria-hidden />
              <span>{label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
