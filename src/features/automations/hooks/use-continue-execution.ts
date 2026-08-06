import { useMutation, useQueryClient } from "@tanstack/react-query";

import { alertToast } from "@/components/ui/sonner";
import { continueExecution } from "@/features/automations/api/continue-execution";
import { executionsQueryKeys } from "@/features/automations/hooks/executions-query-keys";
import type { ExecutionListItem } from "@/features/automations/types/automation";
import { mapExecutionStatus } from "@/features/automations/utils/map-execution-status";

export type ContinueExecutionPayload = {
  executionId: string;
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function useContinueExecution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ executionId }: ContinueExecutionPayload) =>
      continueExecution(executionId),
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
      alertToast.success("Execução retomada", data.message);
    },
    onError: (error: unknown) => {
      alertToast.error(
        "Erro ao retomar execução",
        getErrorMessage(error, "Não foi possível retomar a execução."),
      );
    },
  });
}
