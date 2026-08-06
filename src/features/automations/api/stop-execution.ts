import { getApiErrorMessage } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

import type { ExecutionActionApiResponse } from "@/features/automations/types/automation";

export async function stopExecution(
  executionId: string,
): Promise<ExecutionActionApiResponse> {
  try {
    const { data } = await apiClient.post<ExecutionActionApiResponse>(
      `/executions/${executionId}/stop`,
    );

    return data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível pausar a execução."),
      { cause: error },
    );
  }
}
