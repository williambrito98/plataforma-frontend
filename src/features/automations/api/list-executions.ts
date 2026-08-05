import { getApiErrorMessage } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

import type {
  ExecutionApiResponse,
  ExecutionListItem,
} from "@/features/automations/types/automation";
import { normalizeExecution } from "@/features/automations/utils/normalize-execution";

export async function listExecutions(): Promise<ExecutionListItem[]> {
  try {
    const { data } = await apiClient.get<ExecutionApiResponse[]>("/executions");
    return data.map(normalizeExecution);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível carregar as automações."),
      { cause: error },
    );
  }
}
