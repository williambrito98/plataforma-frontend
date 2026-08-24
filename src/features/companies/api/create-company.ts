import { getApiErrorMessage } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

import type { Company } from "@/features/companies/types/company";
import type { CompanyTheme } from "@/features/companies/types/company-theme";

export type CreateCompanyPayload = {
  name: string;
  document?: string;
  automationIds?: string[];
  theme?: CompanyTheme | null;
  logo?: File | null;
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

export async function createCompany(
  payload: CreateCompanyPayload,
): Promise<Company> {
  try {
    if (payload.logo) {
      const formData = new FormData();
      formData.append("name", payload.name);

      if (payload.document) {
        formData.append("document", payload.document);
      }

      if (payload.automationIds?.length) {
        formData.append("automationIds", JSON.stringify(payload.automationIds));
      }

      appendThemeToFormData(formData, payload.theme);
      formData.append("logo", payload.logo);

      const { data } = await apiClient.post<Company>("/companies", formData);
      return data;
    }

    const { logo: _logo, ...jsonPayload } = payload;
    const { data } = await apiClient.post<Company>("/companies", jsonPayload);
    return data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível cadastrar a empresa."),
      { cause: error },
    );
  }
}
