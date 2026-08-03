import { getApiErrorMessage } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

export async function deleteUser(id: string): Promise<void> {
  try {
    await apiClient.delete(`/users/${id}`);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível remover o usuário."),
      { cause: error },
    );
  }
}
