import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { alertToast } from "@/components/ui/sonner";
import { AuthError } from "@/features/auth/api/auth-error";
import { clearMockSession } from "@/features/auth/api/mock-session";
import { logout } from "@/features/auth/api/logout";
import { authQueryKeys } from "@/features/auth/hooks/auth-query-keys";
import { getApiErrorMessage } from "@/lib/api-error";

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearMockSession();
      queryClient.setQueryData(authQueryKeys.session, null);
      alertToast.success("Logout realizado", "Até logo!");
      navigate({ to: "/login" });
    },
    onError: (error) => {
      const message =
        error instanceof AuthError
          ? error.message
          : getApiErrorMessage(
              error,
              "Não foi possível sair. Tente novamente.",
            );

      alertToast.error("Falha no logout", message);
    },
  });
}
