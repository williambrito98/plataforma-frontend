import { useMutation, useQueryClient } from "@tanstack/react-query";

import { alertToast } from "@/components/ui/sonner";
import { finishExecution } from "@/features/automations/api/finish-execution";
import { executionsQueryKeys } from "@/features/automations/hooks/executions-query-keys";
import {
  removeExecutionDetailCache,
  updateExecutionListCache,
} from "@/features/automations/hooks/update-execution-list-cache";
import { mapExecutionStatus } from "@/features/automations/utils/map-execution-status";
import { useSelectedCompanyId } from "@/features/companies/stores/company-store";

export type FinishExecutionPayload = {
  executionId: string;
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function useFinishExecution() {
  const queryClient = useQueryClient();
  const selectedCompanyId = useSelectedCompanyId();

  return useMutation({
    mutationFn: ({ executionId }: FinishExecutionPayload) =>
      finishExecution(executionId),
    onSuccess: (data) => {
      removeExecutionDetailCache(queryClient, data.id);

      if (selectedCompanyId) {
        updateExecutionListCache(queryClient, selectedCompanyId, (items) =>
          items.map((item) =>
            item.executionId === data.id
              ? {
                  ...item,
                  status: mapExecutionStatus(data.status),
                  startedAt: null,
                  finishedAt: null,
                }
              : item,
          ),
        );
      }

      void queryClient.invalidateQueries({ queryKey: executionsQueryKeys.all });
      alertToast.success("Execução cancelada", data.message);
    },
    onError: (error: unknown) => {
      alertToast.error(
        "Erro ao cancelar execução",
        getErrorMessage(error, "Não foi possível cancelar a execução."),
      );
    },
  });
}
