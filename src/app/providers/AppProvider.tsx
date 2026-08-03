import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthBootstrap } from "@/features/auth/components/auth-bootstrap";
import { queryClient } from "@/lib/query-client";
import { routeTree } from "@/routeTree.gen";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const AppProvider = () => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="plataforma-theme"
    >
      <QueryClientProvider client={queryClient}>
        <AuthBootstrap router={router}>
          <RouterProvider router={router} />
        </AuthBootstrap>
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
};
