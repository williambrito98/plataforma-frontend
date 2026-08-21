import { useQuery } from "@tanstack/react-query";

import { listAutomations } from "@/features/automations/api/list-automations";
import { automationsQueryKeys } from "@/features/automations/hooks/automations-query-keys";

export function useAutomations() {
  return useQuery({
    queryKey: automationsQueryKeys.all,
    queryFn: listAutomations,
  });
}
