import { useQuery } from "@tanstack/react-query";

import { getAutomation } from "@/features/automations/api/get-automation";
import { automationsQueryKeys } from "@/features/automations/hooks/automations-query-keys";

export function useAutomation(id: string) {
  return useQuery({
    queryKey: automationsQueryKeys.detail(id),
    queryFn: () => getAutomation(id),
    enabled: Boolean(id),
  });
}
