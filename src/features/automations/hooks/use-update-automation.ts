import { useMutation, useQueryClient } from "@tanstack/react-query";

import { alertToast } from "@/components/ui/sonner";
import { updateAutomation } from "@/features/automations/api/update-automation";
import { automationsQueryKeys } from "@/features/automations/hooks/automations-query-keys";
import { executionsQueryKeys } from "@/features/automations/hooks/executions-query-keys";
import type { CreateAutomationPayload } from "@/features/automations/types/automation";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

type UpdateAutomationVariables = {
  id: string;
  payload: CreateAutomationPayload;
};

export function useUpdateAutomation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateAutomationVariables) =>
      updateAutomation(id, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: automationsQueryKeys.all,
      });
      void queryClient.invalidateQueries({
        queryKey: automationsQueryKeys.detail(variables.id),
      });
      void queryClient.invalidateQueries({ queryKey: executionsQueryKeys.all });
      alertToast.success(
        "Automação atualizada",
        "Alterações salvas com sucesso.",
      );
    },
    onError: (error: unknown) => {
      alertToast.error(
        "Erro ao atualizar automação",
        getErrorMessage(error, "Não foi possível atualizar a automação."),
      );
    },
  });
}
