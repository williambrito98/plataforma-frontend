import { getApiErrorMessage } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

import type { ExecutionActionApiResponse } from "@/features/automations/types/automation";

export async function executeExecution(
  executionId: string,
  formData: FormData,
): Promise<ExecutionActionApiResponse> {
  try {
    const { data } = await apiClient.post<ExecutionActionApiResponse>(
      `/executions/${executionId}/execute`,
      formData,
    );

    return data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível iniciar a execução."),
      { cause: error },
    );
  }
}
