import { useRouter, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { adminNavigation } from "@/features/admin/config/admin-navigation";
import { resolveRouteAccess } from "@/features/auth/config/route-access";
import { useSession } from "@/features/auth/hooks/use-session";
import {
  checkNavAccess,
  getFirstAccessibleRoute,
} from "@/features/auth/lib/check-access";

type RequireRouteAccessProps = {
  children: ReactNode;
};

function RouteAccessLoadingScreen() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background">
      <div className="flex w-full max-w-xs flex-col items-center gap-4 px-6">
        <Skeleton className="size-12 rounded-md" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

export function RequireRouteAccess({ children }: RequireRouteAccessProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const { user, isLoading } = useSession();
  const router = useRouter();
  const hasRedirectedRef = useRef(false);

  const routeAccess = resolveRouteAccess(pathname);
  const isAuthorized = checkNavAccess(user, routeAccess);

  useEffect(() => {
    hasRedirectedRef.current = false;
  }, [pathname]);

  useEffect(() => {
    if (isLoading || isAuthorized || hasRedirectedRef.current) {
      return;
    }

    hasRedirectedRef.current = true;

    if (window.history.length > 1) {
      router.history.back();
      return;
    }

    void router.navigate({
      to: getFirstAccessibleRoute(user, adminNavigation),
      replace: true,
    });
  }, [isAuthorized, isLoading, router, user]);

  if (isLoading) {
    return <RouteAccessLoadingScreen />;
  }

  if (!isAuthorized) {
    return null;
  }

  return children;
}
