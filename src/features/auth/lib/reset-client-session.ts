import { useAuthStore } from "@/features/auth/stores/auth-store";
import { useCompanyStore } from "@/features/companies/stores/company-store";
import { queryClient } from "@/lib/query-client";

export function resetClientSession(): void {
  queryClient.clear();
  useCompanyStore.getState().clearSelectedCompany();
  useAuthStore.getState().clearUser();
}
