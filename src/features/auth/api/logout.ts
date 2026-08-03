import { AuthError } from "@/features/auth/api/auth-error";
import type { LogoutResponse } from "@/features/auth/types/auth";
import { getApiErrorMessage, getApiErrorStatus } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

export async function logout(): Promise<LogoutResponse> {
  try {
    const { data } = await apiClient.post<LogoutResponse>("/auth/logout");

    return data;
  } catch (error) {
    throw new AuthError(
      getApiErrorMessage(error, "Não foi possível sair. Tente novamente."),
      getApiErrorStatus(error),
    );
  }
}
