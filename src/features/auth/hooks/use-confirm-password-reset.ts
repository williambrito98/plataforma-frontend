import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { alertToast } from "@/components/ui/sonner";
import { AuthError } from "@/features/auth/api/auth-error";
import { confirmPasswordReset } from "@/features/auth/api/confirm-password-reset";
import { bootstrapAuth } from "@/features/auth/lib/bootstrap-auth";
import { resetClientSession } from "@/features/auth/lib/reset-client-session";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import {
  getUserCompanies,
  needsCompanySelection,
} from "@/features/companies/lib/company-selection";
import { useCompanyStore } from "@/features/companies/stores/company-store";
import { queryClient } from "@/lib/query-client";

export function useConfirmPasswordReset() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: confirmPasswordReset,
    onSuccess: async () => {
      queryClient.clear();

      const user = await bootstrapAuth();

      if (!user) {
        resetClientSession();
        alertToast.error(
          "Falha na redefinição",
          "Não foi possível carregar sua sessão. Tente fazer login.",
        );
        return;
      }

      setUser(user);
      useCompanyStore.getState().initializeFromUser(user);

      const selectedCompanyId = useCompanyStore.getState().selectedCompanyId;
      const mustSelectCompany =
        needsCompanySelection(user) &&
        !selectedCompanyId &&
        getUserCompanies(user).length > 1;

      alertToast.success(
        "Senha redefinida",
        "Sua senha foi alterada com sucesso.",
      );

      if (mustSelectCompany) {
        navigate({ to: "/login" });
        return;
      }

      navigate({ to: "/automacoes" });
    },
    onError: (error) => {
      const message =
        error instanceof AuthError
          ? error.message
          : "Não foi possível redefinir a senha. Tente novamente.";

      alertToast.error("Falha na redefinição", message);
    },
  });
}
