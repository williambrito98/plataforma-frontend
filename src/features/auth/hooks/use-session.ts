import { useQuery } from "@tanstack/react-query";

import { getSession } from "@/features/auth/api/get-session";
import { authQueryKeys } from "@/features/auth/hooks/auth-query-keys";

export function useSession() {
  const query = useQuery({
    queryKey: authQueryKeys.session,
    queryFn: getSession,
  });

  return {
    user: query.data ?? null,
    isAuthenticated: Boolean(query.data),
    isLoading: query.isLoading,
  };
}
