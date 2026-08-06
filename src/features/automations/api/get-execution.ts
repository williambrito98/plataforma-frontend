import { getApiErrorMessage } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

import type { ExecutionApiResponse } from "@/features/automations/types/automation";

export async function getExecution(
  executionId: string,
): Promise<ExecutionApiResponse> {
  try {
    const { data } = await apiClient.get<ExecutionApiResponse>(
      `/executions/${executionId}`,
    );
    return data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível carregar a execução."),
      { cause: error },
    );
  }
}
