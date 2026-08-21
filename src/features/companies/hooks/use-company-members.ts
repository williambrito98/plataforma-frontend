import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { alertToast } from "@/components/ui/sonner";
import {
  addCompanyMember,
  listCompanyMembers,
  removeCompanyMember,
} from "@/features/companies/api/company-members";
import { companiesQueryKeys } from "@/features/companies/hooks/companies-query-keys";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function useCompanyMembers(companyId: string) {
  return useQuery({
    queryKey: companiesQueryKeys.members(companyId),
    queryFn: () => listCompanyMembers(companyId),
    enabled: Boolean(companyId),
  });
}

export function useAddCompanyMember(companyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => addCompanyMember(companyId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: companiesQueryKeys.members(companyId),
      });
      alertToast.success("Usuário vinculado", "Usuário vinculado à empresa.");
    },
    onError: (error: unknown) => {
      alertToast.error(
        "Erro ao vincular usuário",
        getErrorMessage(error, "Não foi possível vincular o usuário."),
      );
    },
  });
}

export function useRemoveCompanyMember(companyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => removeCompanyMember(companyId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: companiesQueryKeys.members(companyId),
      });
      alertToast.success(
        "Usuário desvinculado",
        "Usuário removido da empresa.",
      );
    },
    onError: (error: unknown) => {
      alertToast.error(
        "Erro ao desvincular usuário",
        getErrorMessage(error, "Não foi possível desvincular o usuário."),
      );
    },
  });
}
