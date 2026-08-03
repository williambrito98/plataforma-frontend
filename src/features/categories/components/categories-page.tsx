import { useEffect } from "react";

import { alertToast } from "@/components/ui/sonner";
import { PermissionCodes } from "@/features/auth/constants/permissions";
import { useCan } from "@/features/auth/hooks/use-can";
import { CategoriesTable } from "@/features/categories/components/categories-table";
import { CreateCategoryForm } from "@/features/categories/components/create-category-form";
import { useCategories } from "@/features/categories/hooks/use-categories";

export function CategoriesPage() {
  const canCreate = useCan(PermissionCodes.CATEGORIES_CREATE);
  const { data: categories = [], isLoading, isError, error } = useCategories();

  useEffect(() => {
    if (isError) {
      alertToast.error(
        "Erro ao carregar categorias",
        error instanceof Error ? error.message : undefined,
      );
    }
  }, [isError, error]);

  return (
    <div className="flex flex-col gap-6">
      {canCreate ? <CreateCategoryForm /> : null}
      <CategoriesTable categories={categories} isLoading={isLoading} />
    </div>
  );
}
