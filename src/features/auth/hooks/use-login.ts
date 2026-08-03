import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { alertToast } from "@/components/ui/sonner";
import { AuthError } from "@/features/auth/api/auth-error";
import { login } from "@/features/auth/api/login";

export function useLogin() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      alertToast.success("Login realizado", "Bem-vindo de volta!");
      navigate({ to: "/" });
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
