import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { alertToast } from "@/components/ui/sonner";
import { AuthError } from "@/features/auth/api/auth-error";
import { login } from "@/features/auth/api/login";
import { bootstrapAuth } from "@/features/auth/lib/bootstrap-auth";
import { useAuthStore } from "@/features/auth/stores/auth-store";

export function useLogin() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  return useMutation({
    mutationFn: login,
    onSuccess: async () => {
      const user = await bootstrapAuth();

      if (user) {
        setUser(user);
        alertToast.success("Login realizado", "Bem-vindo de volta!");
        navigate({ to: "/automacoes" });
        return;
      }

      clearUser();
      alertToast.error(
        "Falha no login",
        "Não foi possível carregar sua sessão. Tente novamente.",
      );
    },
    onError: (error) => {
      const message =
        error instanceof AuthError
          ? error.message
          : "Não foi possível entrar. Tente novamente.";

      alertToast.error("Falha no login", message);
    },
  });
}
