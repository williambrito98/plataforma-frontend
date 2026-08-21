import { useQuery } from "@tanstack/react-query";

import { listExecutions } from "@/features/automations/api/list-executions";
import { executionsQueryKeys } from "@/features/automations/hooks/executions-query-keys";
import { useSelectedCompanyId } from "@/features/companies/stores/company-store";

export function useExecutions() {
  const selectedCompanyId = useSelectedCompanyId();

  return useQuery({
    queryKey: selectedCompanyId
      ? executionsQueryKeys.list(selectedCompanyId)
      : executionsQueryKeys.all,
    queryFn: () => listExecutions(selectedCompanyId!),
    enabled: Boolean(selectedCompanyId),
  });
}
