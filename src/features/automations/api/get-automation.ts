import { getApiErrorMessage } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

import {
  normalizeAutomation,
  type Automation,
  type AutomationApiResponse,
} from "@/features/automations/types/automation";

export async function getAutomation(id: string): Promise<Automation> {
  try {
    const { data } = await apiClient.get<AutomationApiResponse>(
      `/automations/${id}`,
    );

    return normalizeAutomation(data);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível carregar a automação."),
      { cause: error },
    );
  }
}
