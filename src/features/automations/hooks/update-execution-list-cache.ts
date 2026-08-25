import type { QueryClient } from "@tanstack/react-query";

import { executionsQueryKeys } from "@/features/automations/hooks/executions-query-keys";
import type { ExecutionListItem } from "@/features/automations/types/automation";

export function updateExecutionListCache(
  queryClient: QueryClient,
  companyId: string,
  updater: (items: ExecutionListItem[]) => ExecutionListItem[],
): void {
  queryClient.setQueryData<ExecutionListItem[]>(
    executionsQueryKeys.list(companyId),
    (current) => (current ? updater(current) : current),
  );
}

export function removeExecutionDetailCache(
  queryClient: QueryClient,
  executionId: string,
): void {
  queryClient.removeQueries({
    queryKey: [...executionsQueryKeys.all, "detail", executionId],
  });
}
