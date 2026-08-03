import { getApiErrorMessage } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

import {
  normalizeUserListItem,
  type CreateUserPayload,
  type UserListItem,
  type UserListItemApiResponse,
} from "@/features/users/types/user";

export async function createUser(
  payload: CreateUserPayload,
): Promise<UserListItem> {
  try {
    const { data } = await apiClient.post<UserListItemApiResponse>(
      "/users",
      payload,
    );
    return normalizeUserListItem(data);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível criar o usuário."),
      { cause: error },
    );
  }
}
