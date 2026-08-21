import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/stores/auth-store";
import { executionsQueryKeys } from "@/features/automations/hooks/executions-query-keys";
import { filesQueryKeys } from "@/features/files/hooks/files-query-keys";
import { useCompanyStore } from "@/features/companies/stores/company-store";

export function useSwitchCompany() {
  const queryClient = useQueryClient();
  const user = useAuthUser();
  const setSelectedCompany = useCompanyStore(
    (state) => state.setSelectedCompany,
  );

  return useMutation({
    mutationFn: async (companyId: string) => {
      if (!user) {
        throw new Error("Usuário não autenticado.");
      }

      setSelectedCompany(user.id, companyId);
      return companyId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: executionsQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: filesQueryKeys.all });
    },
  });
}
