import { useMutation, useQueryClient } from "@tanstack/react-query";

import { alertToast } from "@/components/ui/sonner";
import { createCategory } from "@/features/categories/api/create-category";
import { deleteCategory } from "@/features/categories/api/delete-category";
import { updateCategory } from "@/features/categories/api/update-category";
import { categoriesQueryKeys } from "@/features/categories/hooks/categories-query-keys";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.all });
      alertToast.success("Categoria criada", "Categoria criada com sucesso.");
    },
    onError: (error: unknown) => {
      alertToast.error(
        "Erro ao criar categoria",
        getErrorMessage(error, "Não foi possível criar a categoria."),
      );
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateCategory(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.all });
      alertToast.success(
        "Categoria atualizada",
        "Categoria atualizada com sucesso.",
      );
    },
    onError: (error: unknown) => {
      alertToast.error(
        "Erro ao atualizar categoria",
        getErrorMessage(error, "Não foi possível atualizar a categoria."),
      );
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.all });
      alertToast.success(
        "Categoria removida",
        "Categoria removida com sucesso.",
      );
    },
    onError: (error: unknown) => {
      alertToast.error(
        "Erro ao remover categoria",
        getErrorMessage(error, "Não foi possível remover a categoria."),
      );
    },
  });
}
