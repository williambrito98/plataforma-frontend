import { useEffect, useState } from "react";

import { alertToast } from "@/components/ui/sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuditLogDetailSheet } from "@/features/audit-logs/components/audit-log-detail-sheet";
import { AuditLogsTable } from "@/features/audit-logs/components/audit-logs-table";
import { useAuditLogs } from "@/features/audit-logs/hooks/use-audit-logs";
import type {
  AuditAction,
  AuditLogItem,
} from "@/features/audit-logs/types/audit-log";
import {
  AUDIT_ACTION_OPTIONS,
  AUDIT_ENTITY_TYPE_OPTIONS,
} from "@/features/audit-logs/types/audit-log";
import { useCompanies } from "@/features/companies/hooks/use-companies";
import { FilesPagination } from "@/features/files/components/files-pagination";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/lib/pagination";

const ALL_COMPANIES = "ALL";

export function AuditLogsPage() {
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [companyFilter, setCompanyFilter] = useState(ALL_COMPANIES);
  const [actionFilter, setActionFilter] = useState<AuditAction | "ALL">("ALL");
  const [entityTypeFilter, setEntityTypeFilter] = useState("ALL");
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const { data: companies = [], isError: isCompaniesError } = useCompanies();

  const { data, isLoading, isFetching, isError, error } = useAuditLogs({
    page,
    limit: DEFAULT_PAGE_SIZE,
    companyId: companyFilter === ALL_COMPANIES ? undefined : companyFilter,
    action: actionFilter === "ALL" ? undefined : actionFilter,
    entityType: entityTypeFilter === "ALL" ? undefined : entityTypeFilter,
  });

  const logs = data?.items ?? [];
  const meta = data?.meta;

  useEffect(() => {
    setPage(DEFAULT_PAGE);
  }, [companyFilter, actionFilter, entityTypeFilter]);

  useEffect(() => {
    if (isError) {
      alertToast.error(
        "Erro ao carregar auditoria",
        error instanceof Error ? error.message : undefined,
      );
    }
  }, [isError, error]);

  useEffect(() => {
    if (isCompaniesError) {
      alertToast.error("Erro ao carregar empresas para filtro");
    }
  }, [isCompaniesError]);

  function handleViewDetails(log: AuditLogItem) {
    setSelectedLog(log);
    setDetailOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="audit-company-filter">
            Empresa
          </label>
          <Select
            value={companyFilter}
            onValueChange={(value) => setCompanyFilter(value ?? ALL_COMPANIES)}
            items={[
              { label: "Todas as empresas", value: ALL_COMPANIES },
              ...companies.map((company) => ({
                label: company.name,
                value: company.id,
              })),
            ]}
          >
            <SelectTrigger id="audit-company-filter" className="w-full">
              <SelectValue placeholder="Filtrar por empresa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_COMPANIES}>Todas as empresas</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="audit-action-filter">
            Ação
          </label>
          <Select
            value={actionFilter}
            onValueChange={(value) =>
              setActionFilter((value ?? "ALL") as AuditAction | "ALL")
            }
            items={AUDIT_ACTION_OPTIONS.map((option) => ({
              label: option.label,
              value: option.value,
            }))}
          >
            <SelectTrigger id="audit-action-filter" className="w-full">
              <SelectValue placeholder="Filtrar por ação" />
            </SelectTrigger>
            <SelectContent>
              {AUDIT_ACTION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium"
            htmlFor="audit-entity-type-filter"
          >
            Entidade
          </label>
          <Select
            value={entityTypeFilter}
            onValueChange={(value) => setEntityTypeFilter(value ?? "ALL")}
            items={AUDIT_ENTITY_TYPE_OPTIONS.map((option) => ({
              label: option.label,
              value: option.value,
            }))}
          >
            <SelectTrigger id="audit-entity-type-filter" className="w-full">
              <SelectValue placeholder="Filtrar por entidade" />
            </SelectTrigger>
            <SelectContent>
              {AUDIT_ENTITY_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <AuditLogsTable
        logs={logs}
        isLoading={isLoading && !data}
        onViewDetails={handleViewDetails}
      />

      {meta ? (
        <FilesPagination
          meta={meta}
          onPageChange={setPage}
          isLoading={isFetching}
        />
      ) : null}

      <AuditLogDetailSheet
        log={selectedLog}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
