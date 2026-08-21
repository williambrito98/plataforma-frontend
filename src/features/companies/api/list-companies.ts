import { getApiErrorMessage } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

import type { Company } from "@/features/companies/types/company";

type CompanyApiResponse = Company;

export async function listCompanies(): Promise<Company[]> {
  try {
    const { data } = await apiClient.get<CompanyApiResponse[]>("/companies");
    return data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível carregar as empresas."),
      { cause: error },
    );
  }
}
