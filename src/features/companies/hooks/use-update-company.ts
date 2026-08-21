import { useMutation, useQueryClient } from "@tanstack/react-query";

import { alertToast } from "@/components/ui/sonner";
import { executionsQueryKeys } from "@/features/automations/hooks/executions-query-keys";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import {
  updateCompany,
  type UpdateCompanyPayload,
} from "@/features/companies/api/update-company";
import { companiesQueryKeys } from "@/features/companies/hooks/companies-query-keys";
import {
  getUserCompanies,
  resolveInitialCompanyId,
} from "@/features/companies/lib/company-selection";
import { useCompanyStore } from "@/features/companies/stores/company-store";
import type { CompanyStatus } from "@/features/companies/types/company";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

async function refreshCompanySelectionAfterStatusChange(
  companyId: string,
  status: CompanyStatus,
): Promise<void> {
  const user = await useAuthStore.getState().refreshUser();

  if (!user) {
    return;
  }

  const selectedCompanyId = useCompanyStore.getState().selectedCompanyId;

  if (status === "INATIVA" && selectedCompanyId === companyId) {
    const nextCompanyId = resolveInitialCompanyId(user);
    if (nextCompanyId) {
      useCompanyStore.getState().setSelectedCompany(user.id, nextCompanyId);
    } else {
      useCompanyStore.getState().clearSelectedCompany();
    }
  } else if (status === "ATIVA") {
    const companies = getUserCompanies(user);
    const isAlreadySelected = companies.some((c) => c.id === selectedCompanyId);

    if (!isAlreadySelected && companies.some((c) => c.id === companyId)) {
      useCompanyStore.getState().setSelectedCompany(user.id, companyId);
    }
  }
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCompanyPayload;
    }) => updateCompany(id, payload),
    onSuccess: async (_company, variables) => {
      queryClient.invalidateQueries({ queryKey: companiesQueryKeys.all });
      queryClient.invalidateQueries({
        queryKey: companiesQueryKeys.detail(variables.id),
      });

      if (variables.payload.status) {
        await refreshCompanySelectionAfterStatusChange(
          variables.id,
          variables.payload.status,
        );
      }

      if (variables.payload.automationIds !== undefined) {
        queryClient.invalidateQueries({ queryKey: executionsQueryKeys.all });
      }

      alertToast.success(
        "Empresa atualizada",
        "Empresa atualizada com sucesso.",
      );
    },
    onError: (error: unknown) => {
      alertToast.error(
        "Erro ao atualizar empresa",
        getErrorMessage(error, "Não foi possível atualizar a empresa."),
      );
    },
  });
}

export function useUpdateCompanyStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: CompanyStatus }) =>
      updateCompany(id, { status }),
    onSuccess: async (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: companiesQueryKeys.all });
      queryClient.invalidateQueries({
        queryKey: companiesQueryKeys.detail(variables.id),
      });

      await refreshCompanySelectionAfterStatusChange(
        variables.id,
        variables.status,
      );

      const action = variables.status === "INATIVA" ? "inativada" : "ativada";
      alertToast.success(`Empresa ${action}`, `Empresa ${action} com sucesso.`);
    },
    onError: (error: unknown) => {
      alertToast.error(
        "Erro ao atualizar status",
        getErrorMessage(
          error,
          "Não foi possível atualizar o status da empresa.",
        ),
      );
    },
  });
}
