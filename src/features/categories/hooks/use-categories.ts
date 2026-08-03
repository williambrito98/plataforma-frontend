import { useQuery } from "@tanstack/react-query";

import { listCategories } from "@/features/categories/api/list-categories";
import { categoriesQueryKeys } from "@/features/categories/hooks/categories-query-keys";

export function useCategories() {
  return useQuery({
    queryKey: categoriesQueryKeys.all,
    queryFn: listCategories,
  });
}
