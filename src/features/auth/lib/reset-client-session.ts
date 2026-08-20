import { useAuthStore } from "@/features/auth/stores/auth-store";
import { queryClient } from "@/lib/query-client";

export function resetClientSession(): void {
  queryClient.clear();
  useAuthStore.getState().clearUser();
}
