export const companiesQueryKeys = {
  all: ["companies"] as const,
  detail: (id: string) => ["companies", id] as const,
  members: (id: string) => ["companies", id, "members"] as const,
};
