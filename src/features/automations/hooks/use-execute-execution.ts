import { useMutation, useQueryClient } from "@tanstack/react-query";

import { alertToast } from "@/components/ui/sonner";
import { executeExecution } from "@/features/automations/api/execute-execution";
import { executionsQueryKeys } from "@/features/automations/hooks/executions-query-keys";

export type ExecuteExecutionPayload = {
  executionId: string;
  formData: FormData;
  displayValues: Record<string, string>;
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function useExecuteExecution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ executionId, formData }: ExecuteExecutionPayload) =>
      executeExecution(executionId, formData),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: executionsQueryKeys.all });
      alertToast.success("Execução iniciada", data.message);
    },
    onError: (error: unknown) => {
      alertToast.error(
        "Erro ao iniciar execução",
        getErrorMessage(error, "Não foi possível iniciar a execução."),
      );
    },
  });
}
