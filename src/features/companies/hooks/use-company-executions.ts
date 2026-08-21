import { useQuery } from "@tanstack/react-query";

import { listExecutions } from "@/features/automations/api/list-executions";
import { executionsQueryKeys } from "@/features/automations/hooks/executions-query-keys";

export function useCompanyExecutions(companyId: string) {
  return useQuery({
    queryKey: executionsQueryKeys.list(companyId),
    queryFn: () => listExecutions(companyId),
    enabled: Boolean(companyId),
  });
}

export function getLinkedAutomationIds(
  executions: Array<{ automationId: string }>,
): string[] {
  return [...new Set(executions.map((execution) => execution.automationId))];
}
