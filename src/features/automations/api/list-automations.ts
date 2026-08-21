import { getApiErrorMessage } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

import {
  normalizeAutomation,
  type Automation,
  type AutomationApiResponse,
} from "@/features/automations/types/automation";

export async function listAutomations(): Promise<Automation[]> {
  try {
    const { data } =
      await apiClient.get<AutomationApiResponse[]>("/automations");
    return data.map(normalizeAutomation);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível carregar as automações."),
      { cause: error },
    );
  }
}
