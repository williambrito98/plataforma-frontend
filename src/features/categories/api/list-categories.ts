import { getApiErrorMessage } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

import {
  normalizeCategory,
  type Category,
  type CategoryApiResponse,
} from "@/features/categories/types/category";

export async function listCategories(): Promise<Category[]> {
  try {
    const { data } = await apiClient.get<CategoryApiResponse[]>("/categories");
    return data.map(normalizeCategory);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível carregar as categorias."),
      { cause: error },
    );
  }
}
