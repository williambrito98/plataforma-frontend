import axios from "axios";

import { AuthError } from "@/features/auth/api/auth-error";
import type { User } from "@/features/auth/types/auth";
import { getApiErrorMessage, getApiErrorStatus } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

type MeApiResponse = Omit<User, "avatar"> & {
  profilePhoto?: string | null;
};

function normalizeUser(user: MeApiResponse): User {
  return {
    ...user,
    avatar: user.profilePhoto ?? null,
  };
}

export async function getMe(): Promise<User> {
  try {
    const { data } = await apiClient.get<MeApiResponse>("/auth/me");

    return normalizeUser(data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new AuthError(
        getApiErrorMessage(error, "Usuário não encontrado."),
        401,
      );
    }

    throw new AuthError(
      getApiErrorMessage(error, "Não foi possível carregar o perfil."),
      getApiErrorStatus(error),
    );
  }
}
