import { useMutation } from "@tanstack/react-query";

import { alertToast } from "@/components/ui/sonner";
import { AuthError } from "@/features/auth/api/auth-error";
import { requestPasswordReset } from "@/features/auth/api/request-password-reset";

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: (data) => {
      alertToast.success("Código enviado", data.message);
    },
    onError: (error) => {
      const message =
        error instanceof AuthError
          ? error.message
          : "Não foi possível solicitar a recuperação. Tente novamente.";

      alertToast.error("Falha na recuperação", message);
    },
  });
}
