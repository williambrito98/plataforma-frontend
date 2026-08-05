import { useMutation, useQueryClient } from "@tanstack/react-query";

import { alertToast } from "@/components/ui/sonner";
import { createAutomation } from "@/features/automations/api/create-automation";
import { executionsQueryKeys } from "@/features/automations/hooks/executions-query-keys";
import type { CreateAutomationPayload } from "@/features/automations/types/automation";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function useCreateAutomation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAutomationPayload) => createAutomation(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: executionsQueryKeys.all });
      alertToast.success(
        "Automação criada",
        "Configurações salvas com sucesso.",
      );
    },
    onError: (error: unknown) => {
      alertToast.error(
        "Erro ao criar automação",
        getErrorMessage(error, "Não foi possível criar a automação."),
      );
    },
  });
}
