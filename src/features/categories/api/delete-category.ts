import { getApiErrorMessage } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

export async function deleteCategory(id: string): Promise<void> {
  try {
    await apiClient.delete(`/categories/${id}`);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível remover a categoria."),
      { cause: error },
    );
  }
}
