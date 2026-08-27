import { getApiErrorMessage } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  type PaginatedApiResponse,
  type PaginatedResult,
} from "@/lib/pagination";

import {
  normalizeAuditLog,
  type AuditAction,
  type AuditLogApiResponse,
  type AuditLogItem,
} from "@/features/audit-logs/types/audit-log";

type ListAuditLogsParams = {
  companyId?: string;
  page?: number;
  limit?: number;
  action?: AuditAction;
  entityType?: string;
  from?: string;
  to?: string;
};

export async function listAuditLogs({
  companyId,
  page = DEFAULT_PAGE,
  limit = DEFAULT_PAGE_SIZE,
  action,
  entityType,
  from,
  to,
}: ListAuditLogsParams): Promise<PaginatedResult<AuditLogItem>> {
  try {
    const { data } = await apiClient.get<
      PaginatedApiResponse<AuditLogApiResponse>
    >("/audit-logs", {
      params: {
        ...(companyId ? { companyId } : {}),
        page,
        limit,
        ...(action ? { action } : {}),
        ...(entityType ? { entityType } : {}),
        ...(from ? { from } : {}),
        ...(to ? { to } : {}),
      },
    });

    return {
      items: data.data.map(normalizeAuditLog),
      meta: data.meta,
    };
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
        "Não foi possível carregar os logs de auditoria.",
      ),
      { cause: error },
    );
  }
}
