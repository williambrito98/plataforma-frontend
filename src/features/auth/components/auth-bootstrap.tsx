import type { AnyRouter } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { bootstrapAuth } from "@/features/auth/lib/bootstrap-auth";
import { useAuthStore } from "@/features/auth/stores/auth-store";

const PUBLIC_ROUTES = ["/login"] as const;
const DEFAULT_AUTHENTICATED_ROUTE = "/automacoes";

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

type AuthBootstrapProps = {
  router: AnyRouter;
  children: ReactNode;
};

function AuthLoadingScreen() {
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

export function AuthBootstrap({ router, children }: AuthBootstrapProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const setStatus = useAuthStore((state) => state.setStatus);
  const status = useAuthStore((state) => state.status);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function runBootstrap() {
      setStatus("bootstrapping");

      const pathname = window.location.pathname;
      const user = await bootstrapAuth();

      if (!isMounted) {
        return;
      }

      if (user) {
        setUser(user);

        if (isPublicRoute(pathname)) {
          await router.navigate({
            to: DEFAULT_AUTHENTICATED_ROUTE,
            replace: true,
          });
        }
      } else {
        clearUser();

        if (!isPublicRoute(pathname)) {
          await router.navigate({ to: "/login", replace: true });
        }
      }

      setIsReady(true);
    }

    void runBootstrap();

    return () => {
      isMounted = false;
    };
  }, [clearUser, router, setStatus, setUser]);

  if (!isReady || status === "bootstrapping") {
    return <AuthLoadingScreen />;
  }

  return children;
}
