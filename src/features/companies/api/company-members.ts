import { getApiErrorMessage } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

export type CompanyMember = {
  id: string;
  name: string;
  email: string;
  profilePhotoUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

type CompanyMemberApiResponse = CompanyMember;

export async function listCompanyMembers(
  companyId: string,
): Promise<CompanyMember[]> {
  try {
    const { data } = await apiClient.get<CompanyMemberApiResponse[]>(
      `/companies/${companyId}/members`,
    );
    return data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
        "Não foi possível carregar os membros da empresa.",
      ),
      { cause: error },
    );
  }
}

export async function addCompanyMember(
  companyId: string,
  userId: string,
): Promise<CompanyMember> {
  try {
    const { data } = await apiClient.post<CompanyMemberApiResponse>(
      `/companies/${companyId}/members`,
      { userId },
    );
    return data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível vincular o usuário."),
      { cause: error },
    );
  }
}

export async function removeCompanyMember(
  companyId: string,
  userId: string,
): Promise<void> {
  try {
    await apiClient.delete(`/companies/${companyId}/members/${userId}`);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível desvincular o usuário."),
      { cause: error },
    );
  }
}
