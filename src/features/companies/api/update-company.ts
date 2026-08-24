import { getApiErrorMessage } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

import type {
  Company,
  CompanyStatus,
} from "@/features/companies/types/company";
import type { CompanyTheme } from "@/features/companies/types/company-theme";

export type UpdateCompanyPayload = {
  name?: string;
  document?: string;
  status?: CompanyStatus;
  automationIds?: string[];
  theme?: CompanyTheme | null;
  logo?: File | null;
  removeLogo?: boolean;
};

function appendThemeToFormData(
  formData: FormData,
  theme: CompanyTheme | null | undefined,
) {
  if (theme === undefined) {
    return;
  }

  formData.append("theme", theme === null ? "null" : JSON.stringify(theme));
}

function buildFormData(payload: UpdateCompanyPayload): FormData {
  const formData = new FormData();

  if (payload.name !== undefined) {
    formData.append("name", payload.name);
  }

  if (payload.document !== undefined) {
    formData.append("document", payload.document);
  }

  if (payload.status !== undefined) {
    formData.append("status", payload.status);
  }

  if (payload.automationIds !== undefined) {
    formData.append("automationIds", JSON.stringify(payload.automationIds));
  }

  appendThemeToFormData(formData, payload.theme);

  if (payload.removeLogo) {
    formData.append("removeLogo", "true");
  }

  if (payload.logo) {
    formData.append("logo", payload.logo);
  }

  return formData;
}

export async function updateCompany(
  id: string,
  payload: UpdateCompanyPayload,
): Promise<Company> {
  try {
    if (payload.logo) {
      const { data } = await apiClient.patch<Company>(
        `/companies/${id}`,
        buildFormData(payload),
      );
      return data;
    }

    const { logo: _logo, ...jsonPayload } = payload;
    const { data } = await apiClient.patch<Company>(
      `/companies/${id}`,
      jsonPayload,
    );
    return data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível atualizar a empresa."),
      { cause: error },
    );
  }
}

export async function getCompany(id: string): Promise<Company> {
  try {
    const { data } = await apiClient.get<Company>(`/companies/${id}`);
    return data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível carregar a empresa."),
      { cause: error },
    );
  }
}
