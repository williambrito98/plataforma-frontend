import { useMutation } from "@tanstack/react-query";

import { alertToast } from "@/components/ui/sonner";
import { AuthError } from "@/features/auth/api/auth-error";
import { verifyPasswordResetCode } from "@/features/auth/api/verify-password-reset-code";

export function useVerifyPasswordResetCode() {
  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      verifyPasswordResetCode(email, code),
    onError: (error) => {
      const message =
        error instanceof AuthError
          ? error.message
          : "Código inválido ou expirado.";

      alertToast.error("Código inválido", message);
    },
  });
}
