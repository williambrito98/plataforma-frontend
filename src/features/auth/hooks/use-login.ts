import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { alertToast } from "@/components/ui/sonner";
import { AuthError } from "@/features/auth/api/auth-error";
import { login } from "@/features/auth/api/login";
import { bootstrapAuth } from "@/features/auth/lib/bootstrap-auth";
import { resetClientSession } from "@/features/auth/lib/reset-client-session";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import {
  getUserCompanies,
  needsCompanySelection,
} from "@/features/companies/lib/company-selection";
import { useCompanyStore } from "@/features/companies/stores/company-store";
import { queryClient } from "@/lib/query-client";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function useLogin() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: login,
    onSuccess: async (_data, variables) => {
      queryClient.clear();

      const user = await bootstrapAuth();
      const expectedEmail = normalizeEmail(variables.email);

      if (!user) {
        resetClientSession();
        alertToast.error(
          "Falha no login",
          "Não foi possível carregar sua sessão. Tente novamente.",
        );
        return;
      }

      if (normalizeEmail(user.email) !== expectedEmail) {
        resetClientSession();
        alertToast.error(
          "Falha no login",
          "A sessão anterior não foi encerrada corretamente. Saia e tente novamente.",
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

      alertToast.success("Login realizado", "Bem-vindo de volta!");

      if (mustSelectCompany) {
        return;
      }

      navigate({ to: "/automacoes" });
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
