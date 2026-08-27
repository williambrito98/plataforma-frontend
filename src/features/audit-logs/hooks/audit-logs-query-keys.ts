export const auditLogsQueryKeys = {
  all: ["audit-logs"] as const,
  list: (
    companyId: string | undefined,
    page: number,
    limit: number,
    action?: string,
    entityType?: string,
    from?: string,
    to?: string,
  ) =>
    [
      ...auditLogsQueryKeys.all,
      companyId ?? "all",
      page,
      limit,
      action ?? "all",
      entityType ?? "all",
      from ?? "",
      to ?? "",
    ] as const,
};
