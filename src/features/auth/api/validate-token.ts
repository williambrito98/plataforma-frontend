import axios from "axios";

import { AuthError } from "@/features/auth/api/auth-error";
import type { ValidateTokenResponse } from "@/features/auth/types/auth";
import { getApiErrorMessage, getApiErrorStatus } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

export async function validateToken(): Promise<ValidateTokenResponse> {
  try {
    const { data } =
      await apiClient.get<ValidateTokenResponse>("/auth/validate");

    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new AuthError(
        getApiErrorMessage(error, "Token inválido ou expirado."),
        401,
      );
    }

    throw new AuthError(
      getApiErrorMessage(error, "Não foi possível validar a sessão."),
      getApiErrorStatus(error),
    );
  }
}
