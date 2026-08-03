import { useQuery } from "@tanstack/react-query";

import { listFiles } from "@/features/files/api/list-files";
import { filesQueryKeys } from "@/features/files/hooks/files-query-keys";

export function useFiles() {
  return useQuery({
    queryKey: filesQueryKeys.all,
    queryFn: listFiles,
  });
}
