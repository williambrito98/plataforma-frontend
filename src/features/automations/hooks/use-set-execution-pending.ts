import { useMutation, useQueryClient } from "@tanstack/react-query";

import { alertToast } from "@/components/ui/sonner";
import { setExecutionPending } from "@/features/automations/api/set-execution-pending";
import { executionsQueryKeys } from "@/features/automations/hooks/executions-query-keys";
import type { ExecutionListItem } from "@/features/automations/types/automation";
import { mapExecutionStatus } from "@/features/automations/utils/map-execution-status";

export type SetExecutionPendingPayload = {
  executionId: string;
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function useSetExecutionPending() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ executionId }: SetExecutionPendingPayload) =>
      setExecutionPending(executionId),
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
      alertToast.success("Execução reiniciada", data.message);
    },
    onError: (error: unknown) => {
      alertToast.error(
        "Erro ao reiniciar execução",
        getErrorMessage(error, "Não foi possível reiniciar a execução."),
      );
    },
  });
}
