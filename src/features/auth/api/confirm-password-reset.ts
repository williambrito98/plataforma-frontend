import { AuthError } from "@/features/auth/api/auth-error";
import { getApiErrorMessage, getApiErrorStatus } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

export type ConfirmPasswordResetRequest = {
  email: string;
  code: string;
  password: string;
};

export type ConfirmPasswordResetResponse = {
  message: string;
};

export async function confirmPasswordReset(
  data: ConfirmPasswordResetRequest,
): Promise<ConfirmPasswordResetResponse> {
  try {
    const { data: response } =
      await apiClient.post<ConfirmPasswordResetResponse>(
        "/auth/password-reset/confirm",
        {
          email: data.email.trim().toLowerCase(),
          code: data.code,
          password: data.password,
        },
      );

    return response;
  } catch (error) {
    throw new AuthError(
      getApiErrorMessage(
        error,
        "Não foi possível redefinir a senha. Tente novamente.",
      ),
      getApiErrorStatus(error),
    );
  }
}
