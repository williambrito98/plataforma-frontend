import { AuthError } from "@/features/auth/api/auth-error";
import { getApiErrorMessage, getApiErrorStatus } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

export type RequestPasswordResetResponse = {
  message: string;
};

export async function requestPasswordReset(
  email: string,
): Promise<RequestPasswordResetResponse> {
  try {
    const { data } = await apiClient.post<RequestPasswordResetResponse>(
      "/auth/password-reset/request",
      { email: email.trim().toLowerCase() },
    );

    return data;
  } catch (error) {
    throw new AuthError(
      getApiErrorMessage(
        error,
        "Não foi possível solicitar a recuperação. Tente novamente.",
      ),
      getApiErrorStatus(error),
    );
  }
}
