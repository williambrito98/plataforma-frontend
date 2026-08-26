import type { QueryClient } from "@tanstack/react-query";

import { usersQueryKeys } from "@/features/users/hooks/users-query-keys";
import type { UserListItem } from "@/features/users/types/user";

export function updateUsersListCache(
  queryClient: QueryClient,
  updater: (users: UserListItem[]) => UserListItem[],
): void {
  queryClient.setQueryData<UserListItem[]>(usersQueryKeys.all, (current) =>
    current ? updater(current) : current,
  );
}
