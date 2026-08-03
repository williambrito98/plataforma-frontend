import { getApiErrorMessage } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

import {
  normalizeCategory,
  type Category,
  type CategoryApiResponse,
} from "@/features/categories/types/category";

export type CreateCategoryPayload = {
  name: string;
};

export async function createCategory(
  payload: CreateCategoryPayload,
): Promise<Category> {
  try {
    const { data } = await apiClient.post<CategoryApiResponse>(
      "/categories",
      payload,
    );
    return normalizeCategory(data);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível criar a categoria."),
      { cause: error },
    );
  }
}
