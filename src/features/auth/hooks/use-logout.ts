import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { alertToast } from "@/components/ui/sonner";
import { AuthError } from "@/features/auth/api/auth-error";
import { logout } from "@/features/auth/api/logout";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { getApiErrorMessage } from "@/lib/api-error";

export function useLogout() {
  const navigate = useNavigate();
  const clearUser = useAuthStore((state) => state.clearUser);

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearUser();
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
