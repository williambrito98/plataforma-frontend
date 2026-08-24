import { useMutation, useQueryClient } from "@tanstack/react-query";

import { alertToast } from "@/components/ui/sonner";
import { executionsQueryKeys } from "@/features/automations/hooks/executions-query-keys";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { createCompany } from "@/features/companies/api/create-company";
import { companiesQueryKeys } from "@/features/companies/hooks/companies-query-keys";
import { mergeCompanyInAuthUser } from "@/features/companies/lib/merge-company-in-auth-user";
import { useCompanyStore } from "@/features/companies/stores/company-store";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCompany,
    onSuccess: async (company) => {
      mergeCompanyInAuthUser(company);

      const previousSelectedId = useCompanyStore.getState().selectedCompanyId;
      const user = await useAuthStore.getState().refreshUser();

      if (user && !previousSelectedId) {
        useCompanyStore.getState().setSelectedCompany(user.id, company.id);
      }

      queryClient.invalidateQueries({ queryKey: companiesQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: executionsQueryKeys.all });

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
