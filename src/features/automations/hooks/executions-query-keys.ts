export const executionsQueryKeys = {
  all: ["executions"] as const,
  list: (companyId: string) => ["executions", companyId] as const,
};
