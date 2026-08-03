import { getApiErrorMessage } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

import {
  normalizeUserListItem,
  type UserListItem,
  type UserListItemApiResponse,
} from "@/features/users/types/user";

export type UpdateUserPayload = {
  name?: string;
  password?: string;
};

export async function updateUser(
  id: string,
  payload: UpdateUserPayload,
): Promise<UserListItem> {
  try {
    const { data } = await apiClient.patch<UserListItemApiResponse>(
      `/users/${id}`,
      payload,
    );
    return normalizeUserListItem(data);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível atualizar o perfil."),
      { cause: error },
    );
  }
}

export async function updateUserPhoto(
  id: string,
  file: File,
): Promise<UserListItem> {
  const formData = new FormData();
  formData.append("photo", file);

  try {
    const { data } = await apiClient.patch<UserListItemApiResponse>(
      `/users/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return normalizeUserListItem(data);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível atualizar a foto."),
      { cause: error },
    );
  }
}
