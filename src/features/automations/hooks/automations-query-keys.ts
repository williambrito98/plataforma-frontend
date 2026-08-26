export const automationsQueryKeys = {
  all: ["automations"] as const,
  detail: (id: string) => ["automations", id] as const,
};
