import { useAuthStore } from "@/features/auth/stores/auth-store";

export function useSession() {
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);

  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading: status === "bootstrapping" || status === "idle",
  };
}
