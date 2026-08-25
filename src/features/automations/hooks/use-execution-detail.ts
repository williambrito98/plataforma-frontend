import { useQuery, type Query } from "@tanstack/react-query";

import { getExecution } from "@/features/automations/api/get-execution";
import { executionsQueryKeys } from "@/features/automations/hooks/executions-query-keys";
import type { ExecutionApiResponse } from "@/features/automations/types/automation";

type UseExecutionDetailOptions = {
  refetchInterval?:
    | number
    | false
    | ((query: Query<ExecutionApiResponse>) => number | false | undefined);
};

export function useExecutionDetail(
  executionId: string,
  enabled: boolean,
  options: UseExecutionDetailOptions = {},
) {
  return useQuery({
    queryKey: [...executionsQueryKeys.all, "detail", executionId] as const,
    queryFn: () => getExecution(executionId),
    enabled,
    staleTime: 30_000,
    refetchInterval: options.refetchInterval,
  });
}
