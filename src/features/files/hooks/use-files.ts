import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { listFiles } from "@/features/files/api/list-files";
import { filesQueryKeys } from "@/features/files/hooks/files-query-keys";
import { useSelectedCompanyId } from "@/features/companies/stores/company-store";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/lib/pagination";

type UseFilesOptions = {
  page?: number;
  limit?: number;
};

export function useFiles({
  page = DEFAULT_PAGE,
  limit = DEFAULT_PAGE_SIZE,
}: UseFilesOptions = {}) {
  const selectedCompanyId = useSelectedCompanyId();

  return useQuery({
    queryKey: selectedCompanyId
      ? filesQueryKeys.list(selectedCompanyId, page, limit)
      : filesQueryKeys.all,
    queryFn: () =>
      listFiles({
        companyId: selectedCompanyId!,
        page,
        limit,
      }),
    enabled: Boolean(selectedCompanyId),
    placeholderData: keepPreviousData,
  });
}
