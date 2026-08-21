export const filesQueryKeys = {
  all: ["files"] as const,
  list: (companyId: string) => ["files", companyId] as const,
};
