import { getApiErrorMessage } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

import {
  normalizeCategory,
  type Category,
  type CategoryApiResponse,
} from "@/features/categories/types/category";

export type UpdateCategoryPayload = {
  name: string;
};

export async function updateCategory(
  id: string,
  payload: UpdateCategoryPayload,
): Promise<Category> {
  try {
    const { data } = await apiClient.patch<CategoryApiResponse>(
      `/categories/${id}`,
      payload,
    );
    return normalizeCategory(data);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível atualizar a categoria."),
      { cause: error },
    );
  }
}
