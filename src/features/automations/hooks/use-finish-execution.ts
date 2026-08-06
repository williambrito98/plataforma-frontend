import { useMutation, useQueryClient } from "@tanstack/react-query";

import { alertToast } from "@/components/ui/sonner";
import { finishExecution } from "@/features/automations/api/finish-execution";
import { executionsQueryKeys } from "@/features/automations/hooks/executions-query-keys";
import type { ExecutionListItem } from "@/features/automations/types/automation";
import { mapExecutionStatus } from "@/features/automations/utils/map-execution-status";

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

  return useMutation({
    mutationFn: ({ executionId }: FinishExecutionPayload) =>
      finishExecution(executionId),
    onSuccess: (data) => {
      queryClient.setQueryData<ExecutionListItem[]>(
        executionsQueryKeys.all,
        (current) =>
          current?.map((item) =>
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
