import { useMutation, useQueryClient } from "@tanstack/react-query";

import { alertToast } from "@/components/ui/sonner";
import { continueExecution } from "@/features/automations/api/continue-execution";
import { executionsQueryKeys } from "@/features/automations/hooks/executions-query-keys";
import { updateExecutionListCache } from "@/features/automations/hooks/update-execution-list-cache";
import { mapExecutionStatus } from "@/features/automations/utils/map-execution-status";
import { useSelectedCompanyId } from "@/features/companies/stores/company-store";

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
  const selectedCompanyId = useSelectedCompanyId();

  return useMutation({
    mutationFn: ({ executionId }: ContinueExecutionPayload) =>
      continueExecution(executionId),
    onSuccess: (data) => {
      if (selectedCompanyId) {
        updateExecutionListCache(queryClient, selectedCompanyId, (items) =>
          items.map((item) =>
            item.executionId === data.id
              ? { ...item, status: mapExecutionStatus(data.status) }
              : item,
          ),
        );
      }

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
