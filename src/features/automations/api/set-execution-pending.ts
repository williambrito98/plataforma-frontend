import { getApiErrorMessage } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

import type { ExecutionActionApiResponse } from "@/features/automations/types/automation";

export async function setExecutionPending(
  executionId: string,
): Promise<ExecutionActionApiResponse> {
  try {
    const { data } = await apiClient.post<ExecutionActionApiResponse>(
      `/executions/${executionId}/pending`,
    );

    return data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível reiniciar a execução."),
      { cause: error },
    );
  }
}
