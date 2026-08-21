export type CompanySummary = {
  id: string;
  name: string;
  document: string | null;
};

export type Company = CompanySummary & {
  createdAt: string;
  updatedAt: string;
};
