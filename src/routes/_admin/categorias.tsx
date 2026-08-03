import { createFileRoute } from "@tanstack/react-router";

import { CategoriesPage } from "@/features/categories/components/categories-page";
import { PermissionCodes } from "@/features/auth/constants/permissions";

export const Route = createFileRoute("/_admin/categorias")({
  staticData: {
    access: { permissions: [PermissionCodes.CATEGORIES_READ] },
  },
  component: CategoriasRoutePage,
});

function CategoriasRoutePage() {
  return <CategoriesPage />;
}
