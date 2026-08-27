import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { listAuditLogs } from "@/features/audit-logs/api/list-audit-logs";
import { auditLogsQueryKeys } from "@/features/audit-logs/hooks/audit-logs-query-keys";
import type { AuditAction } from "@/features/audit-logs/types/audit-log";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/lib/pagination";

type UseAuditLogsOptions = {
  page?: number;
  limit?: number;
  companyId?: string;
  action?: AuditAction;
  entityType?: string;
  from?: string;
  to?: string;
};

export function useAuditLogs({
  page = DEFAULT_PAGE,
  limit = DEFAULT_PAGE_SIZE,
  companyId,
  action,
  entityType,
  from,
  to,
}: UseAuditLogsOptions = {}) {
  return useQuery({
    queryKey: auditLogsQueryKeys.list(
      companyId,
      page,
      limit,
      action,
      entityType,
      from,
      to,
    ),
    queryFn: () =>
      listAuditLogs({
        companyId,
        page,
        limit,
        action,
        entityType,
        from,
        to,
      }),
    placeholderData: keepPreviousData,
  });
}
