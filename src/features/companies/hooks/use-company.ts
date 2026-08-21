import { useQuery } from "@tanstack/react-query";

import { getCompany } from "@/features/companies/api/update-company";
import { companiesQueryKeys } from "@/features/companies/hooks/companies-query-keys";

export function useCompany(id: string) {
  return useQuery({
    queryKey: companiesQueryKeys.detail(id),
    queryFn: () => getCompany(id),
    enabled: Boolean(id),
  });
}
