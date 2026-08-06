import { getApiErrorMessage } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

import type { ExecutionActionApiResponse } from "@/features/automations/types/automation";

export async function finishExecution(
  executionId: string,
): Promise<ExecutionActionApiResponse> {
  try {
    const { data } = await apiClient.patch<ExecutionActionApiResponse>(
      `/executions/${executionId}/finish`,
    );

    return data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível cancelar a execução."),
      { cause: error },
    );
  }
}
