import { AuthError } from "@/features/auth/api/auth-error";
import type { LoginRequest, LoginResponse } from "@/features/auth/types/auth";
import { getApiErrorMessage, getApiErrorStatus } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

export async function login(data: LoginRequest): Promise<LoginResponse> {
  try {
    const { data: response } = await apiClient.post<LoginResponse>(
      "/auth/login",
      { email: data.email.trim(), password: data.password },
    );

    return response;
  } catch (error) {
    throw new AuthError(
      getApiErrorMessage(error, "Não foi possível entrar. Tente novamente."),
      getApiErrorStatus(error),
    );
  }
}
