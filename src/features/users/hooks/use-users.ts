import { useQuery } from "@tanstack/react-query";

import { listUsers } from "@/features/users/api/list-users";
import { usersQueryKeys } from "@/features/users/hooks/users-query-keys";

export function useUsers(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: usersQueryKeys.all,
    queryFn: listUsers,
    enabled: options?.enabled ?? true,
  });
}
