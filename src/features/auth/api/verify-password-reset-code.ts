import { AuthError } from "@/features/auth/api/auth-error";
import { getApiErrorMessage, getApiErrorStatus } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

export type VerifyPasswordResetCodeResponse = {
  valid: true;
};

export async function verifyPasswordResetCode(
  email: string,
  code: string,
): Promise<VerifyPasswordResetCodeResponse> {
  try {
    const { data } = await apiClient.post<VerifyPasswordResetCodeResponse>(
      "/auth/password-reset/verify",
      { email: email.trim().toLowerCase(), code },
    );

    return data;
  } catch (error) {
    throw new AuthError(
      getApiErrorMessage(error, "Código inválido ou expirado."),
      getApiErrorStatus(error),
    );
  }
}
