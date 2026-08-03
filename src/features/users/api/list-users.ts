import { getApiErrorMessage } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

import {
  normalizeUserListItem,
  type UserListItem,
  type UserListItemApiResponse,
} from "@/features/users/types/user";

export async function listUsers(): Promise<UserListItem[]> {
  try {
    const { data } = await apiClient.get<UserListItemApiResponse[]>("/users");
    return data.map(normalizeUserListItem);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível carregar os usuários."),
      { cause: error },
    );
  }
}
