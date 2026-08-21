import { getApiErrorMessage } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

import type {
  Company,
  CompanyStatus,
} from "@/features/companies/types/company";

export type UpdateCompanyPayload = {
  name?: string;
  document?: string;
  status?: CompanyStatus;
  automationIds?: string[];
};

type CompanyApiResponse = Company;

export async function updateCompany(
  id: string,
  payload: UpdateCompanyPayload,
): Promise<Company> {
  try {
    const { data } = await apiClient.patch<CompanyApiResponse>(
      `/companies/${id}`,
      payload,
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
    const { data } = await apiClient.get<CompanyApiResponse>(
      `/companies/${id}`,
    );
    return data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível carregar a empresa."),
      { cause: error },
    );
  }
}
