import { useQuery } from "@tanstack/react-query";

import { listCompanies } from "@/features/companies/api/list-companies";
import { companiesQueryKeys } from "@/features/companies/hooks/companies-query-keys";

export function useCompanies() {
  return useQuery({
    queryKey: companiesQueryKeys.all,
    queryFn: listCompanies,
  });
}
