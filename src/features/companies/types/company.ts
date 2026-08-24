import type { CompanyTheme } from "@/features/companies/types/company-theme";

export type CompanyStatus = "ATIVA" | "INATIVA";

export type CompanySummary = {
  id: string;
  name: string;
  document: string | null;
  status?: CompanyStatus;
  theme?: CompanyTheme | null;
  logoUrl?: string | null;
};

export type Company = CompanySummary & {
  status: CompanyStatus;
  theme: CompanyTheme | null;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
};
