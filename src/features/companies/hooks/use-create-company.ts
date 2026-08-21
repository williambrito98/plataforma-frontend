import { useMutation } from "@tanstack/react-query";

import { alertToast } from "@/components/ui/sonner";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { createCompany } from "@/features/companies/api/create-company";
import { useCompanyStore } from "@/features/companies/stores/company-store";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function useCreateCompany() {
  return useMutation({
    mutationFn: createCompany,
    onSuccess: async (company) => {
      const user = await useAuthStore.getState().refreshUser();

      if (user) {
        useCompanyStore.getState().setSelectedCompany(user.id, company.id);
      }

      alertToast.success("Empresa cadastrada", "Empresa criada com sucesso.");
    },
    onError: (error: unknown) => {
      alertToast.error(
        "Erro ao cadastrar empresa",
        getErrorMessage(error, "Não foi possível cadastrar a empresa."),
      );
    },
  });
}
