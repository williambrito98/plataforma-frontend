import { getApiErrorMessage } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

import {
  normalizeAutomation,
  serializeAutomationFields,
  type Automation,
  type AutomationApiResponse,
  type CreateAutomationPayload,
} from "@/features/automations/types/automation";

export async function createAutomation(
  payload: CreateAutomationPayload,
): Promise<Automation> {
  try {
    const { data } = await apiClient.post<AutomationApiResponse>(
      "/automations",
      {
        name: payload.name,
        description: payload.description,
        path: payload.path,
        categoryId: payload.categoryId,
        fields: serializeAutomationFields(payload.fields),
      },
    );

    return normalizeAutomation(data);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível criar a automação."),
      { cause: error },
    );
  }
}
