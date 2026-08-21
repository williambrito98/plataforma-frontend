import { useQuery } from "@tanstack/react-query";

import { listFiles } from "@/features/files/api/list-files";
import { filesQueryKeys } from "@/features/files/hooks/files-query-keys";
import { useSelectedCompanyId } from "@/features/companies/stores/company-store";

export function useFiles() {
  const selectedCompanyId = useSelectedCompanyId();

  return useQuery({
    queryKey: selectedCompanyId
      ? filesQueryKeys.list(selectedCompanyId)
      : filesQueryKeys.all,
    queryFn: () => listFiles(selectedCompanyId!),
    enabled: Boolean(selectedCompanyId),
  });
}
