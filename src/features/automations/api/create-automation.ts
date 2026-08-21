import { getApiErrorMessage } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

import {
  normalizeAutomation,
  serializeAutomationFields,
  type Automation,
  type AutomationApiResponse,
  type CreateAutomationPayload,
} from "@/features/automations/types/automation";

function buildCreateAutomationFormData(
  payload: CreateAutomationPayload,
): FormData {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("description", payload.description);
  formData.append("path", payload.path);
  formData.append("categoryId", payload.categoryId);
  formData.append(
    "fields",
    JSON.stringify(serializeAutomationFields(payload.fields)),
  );

  for (const parameter of payload.fields) {
    if (parameter.type === "file" && parameter.templateFileUpload) {
      formData.append(
        `templateFiles[${parameter.name}]`,
        parameter.templateFileUpload,
      );
    }
  }

  return formData;
}

export async function createAutomation(
  payload: CreateAutomationPayload,
): Promise<Automation> {
  try {
    const formData = buildCreateAutomationFormData(payload);

    const { data } = await apiClient.post<AutomationApiResponse>(
      "/automations",
      formData,
    );

    return normalizeAutomation(data);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível criar a automação."),
      { cause: error },
    );
  }
}
