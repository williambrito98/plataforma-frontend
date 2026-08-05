import { useQuery } from "@tanstack/react-query";

import { listExecutions } from "@/features/automations/api/list-executions";
import { executionsQueryKeys } from "@/features/automations/hooks/executions-query-keys";

export function useExecutions() {
  return useQuery({
    queryKey: executionsQueryKeys.all,
    queryFn: listExecutions,
  });
}
