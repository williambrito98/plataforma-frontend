import { create } from "zustand";

import {
  persistSelectedCompany,
  resolveInitialCompanyId,
} from "@/features/companies/lib/company-selection";
import type { CompanySummary } from "@/features/companies/types/company";
import type { User } from "@/features/auth/types/auth";

type CompanyState = {
  selectedCompanyId: string | null;
  setSelectedCompany: (userId: string, companyId: string) => void;
  clearSelectedCompany: () => void;
  initializeFromUser: (user: User) => string | null;
};

export const useCompanyStore = create<CompanyState>((set) => ({
  selectedCompanyId: null,
  setSelectedCompany: (userId, companyId) => {
    persistSelectedCompany(userId, companyId);
    set({ selectedCompanyId: companyId });
  },
  clearSelectedCompany: () => set({ selectedCompanyId: null }),
  initializeFromUser: (user) => {
    const companyId = resolveInitialCompanyId(user);

    if (companyId) {
      persistSelectedCompany(user.id, companyId);
    }

    set({ selectedCompanyId: companyId });
    return companyId;
  },
}));

export function useSelectedCompanyId() {
  return useCompanyStore((state) => state.selectedCompanyId);
}

export function findCompanyById(
  companies: CompanySummary[],
  companyId: string | null,
): CompanySummary | null {
  if (!companyId) {
    return null;
  }

  return companies.find((company) => company.id === companyId) ?? null;
}
