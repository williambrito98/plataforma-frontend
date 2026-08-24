import { useAuthStore } from "@/features/auth/stores/auth-store";
import type { CompanySummary } from "@/features/companies/types/company";

export function mergeCompanyInAuthUser(updatedCompany: CompanySummary): void {
  const user = useAuthStore.getState().user;

  if (!user?.companies?.length) {
    return;
  }

  useAuthStore.getState().setUser({
    ...user,
    companies: user.companies.map((company) =>
      company.id === updatedCompany.id
        ? { ...company, ...updatedCompany }
        : company,
    ),
  });
}
