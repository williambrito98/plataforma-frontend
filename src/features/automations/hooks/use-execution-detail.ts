import { useQuery } from "@tanstack/react-query";

import { getExecution } from "@/features/automations/api/get-execution";
import { executionsQueryKeys } from "@/features/automations/hooks/executions-query-keys";

export function useExecutionDetail(executionId: string, enabled: boolean) {
  return useQuery({
    queryKey: [...executionsQueryKeys.all, "detail", executionId] as const,
    queryFn: () => getExecution(executionId),
    enabled,
    staleTime: 30_000,
  });
}
