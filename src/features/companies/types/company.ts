export type CompanyStatus = "ATIVA" | "INATIVA";

export type CompanySummary = {
  id: string;
  name: string;
  document: string | null;
  status?: CompanyStatus;
};

export type Company = CompanySummary & {
  status: CompanyStatus;
  createdAt: string;
  updatedAt: string;
};
