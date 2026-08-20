import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { alertToast } from "@/components/ui/sonner";
import { AuthError } from "@/features/auth/api/auth-error";
import { logout } from "@/features/auth/api/logout";
import { resetClientSession } from "@/features/auth/lib/reset-client-session";
import { getApiErrorMessage } from "@/lib/api-error";

export function useLogout() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      resetClientSession();
      alertToast.success("Logout realizado", "Até logo!");
      navigate({ to: "/login" });
    },
    onError: (error) => {
      resetClientSession();

      const message =
        error instanceof AuthError
          ? error.message
          : getApiErrorMessage(
              error,
              "Não foi possível sair. Tente novamente.",
            );

      alertToast.warning("Sessão encerrada localmente", message);
      navigate({ to: "/login" });
    },
  });
}
