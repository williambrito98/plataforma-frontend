import type { CompanySummary } from "@/features/companies/types/company";
import type { User } from "@/features/auth/types/auth";

import {
  readStoredCompanyId,
  writeStoredCompanyId,
} from "@/features/companies/lib/company-storage";

export function getUserCompanies(
  user: User | null | undefined,
): CompanySummary[] {
  return user?.companies ?? [];
}

export function needsCompanySelection(user: User | null | undefined): boolean {
  const companies = getUserCompanies(user);

  if (companies.length <= 1) {
    return false;
  }

  return true;
}

export function resolveInitialCompanyId(user: User): string | null {
  const companies = getUserCompanies(user);

  if (companies.length === 0) {
    return null;
  }

  if (companies.length === 1) {
    return companies[0].id;
  }

  const storedId = readStoredCompanyId(user.id);
  const isStoredValid = storedId
    ? companies.some((company) => company.id === storedId)
    : false;

  return isStoredValid ? storedId : null;
}

export function persistSelectedCompany(
  userId: string,
  companyId: string,
): void {
  writeStoredCompanyId(userId, companyId);
}
