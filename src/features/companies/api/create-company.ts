import { getApiErrorMessage } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

import type { Company } from "@/features/companies/types/company";

export type CreateCompanyPayload = {
  name: string;
  document?: string;
};

type CompanyApiResponse = Company;

export async function createCompany(
  payload: CreateCompanyPayload,
): Promise<Company> {
  try {
    const { data } = await apiClient.post<CompanyApiResponse>(
      "/companies",
      payload,
    );
    return data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível cadastrar a empresa."),
      { cause: error },
    );
  }
}
