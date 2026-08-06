import { useMutation, useQueryClient } from "@tanstack/react-query";

import { alertToast } from "@/components/ui/sonner";
import { stopExecution } from "@/features/automations/api/stop-execution";
import { executionsQueryKeys } from "@/features/automations/hooks/executions-query-keys";
import type { ExecutionListItem } from "@/features/automations/types/automation";
import { mapExecutionStatus } from "@/features/automations/utils/map-execution-status";

export type StopExecutionPayload = {
  executionId: string;
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function useStopExecution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ executionId }: StopExecutionPayload) =>
      stopExecution(executionId),
    onSuccess: (data) => {
      queryClient.setQueryData<ExecutionListItem[]>(
        executionsQueryKeys.all,
        (current) =>
          current?.map((item) =>
            item.executionId === data.id
              ? { ...item, status: mapExecutionStatus(data.status) }
              : item,
          ),
      );

      void queryClient.invalidateQueries({ queryKey: executionsQueryKeys.all });
      alertToast.success("Execução pausada", data.message);
    },
    onError: (error: unknown) => {
      alertToast.error(
        "Erro ao pausar execução",
        getErrorMessage(error, "Não foi possível pausar a execução."),
      );
    },
  });
}
