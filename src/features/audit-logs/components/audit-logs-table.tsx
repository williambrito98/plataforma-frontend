import { ChevronRight, EyeIcon } from "lucide-react";

import {
  MobileCardList,
  MobileCardSkeletons,
} from "@/components/mobile-card-list";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AuditLogItem } from "@/features/audit-logs/types/audit-log";
import {
  formatAuditAction,
  formatAuditEntityType,
} from "@/features/audit-logs/utils/format-audit-action";
import { formatFileDate } from "@/features/files/utils/format-file-date";

const SKELETON_ROW_COUNT = 5;

type AuditLogsTableProps = {
  logs: AuditLogItem[];
  isLoading?: boolean;
  onViewDetails: (log: AuditLogItem) => void;
};

function actionVariant(action: AuditLogItem["action"]) {
  if (action === "CREATE") return "success" as const;
  if (action === "DELETE") return "error" as const;
  return "info" as const;
}

export function AuditLogsTable({
  logs,
  isLoading = false,
  onViewDetails,
}: AuditLogsTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Logs de auditoria</CardTitle>
        </CardHeader>
        <CardContent>
          <MobileCardList>
            <MobileCardSkeletons />
          </MobileCardList>
          <div className="space-y-3 max-md:hidden">
            {Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
              <div
                key={index}
                className="h-10 animate-pulse rounded-md bg-muted"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logs de auditoria</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum log encontrado para os filtros selecionados.
          </p>
        ) : (
          <>
            <div className="max-md:hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/hora</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Entidade</TableHead>
                    <TableHead className="text-right">Detalhes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => {
                    const variant = actionVariant(log.action);

                    return (
                      <TableRow key={log.id}>
                        <TableCell className="whitespace-nowrap">
                          {formatFileDate(log.createdAt)}
                        </TableCell>
                        <TableCell>
                          {log.user ? (
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {log.user.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {log.user.email}
                              </span>
                            </div>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell>{log.company?.name ?? "—"}</TableCell>
                        <TableCell>
                          <Badge variant={variant} category={variant}>
                            {formatAuditAction(log.action)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{formatAuditEntityType(log.entityType)}</span>
                            {log.entityId ? (
                              <span className="text-xs text-muted-foreground">
                                #{log.entityId}
                              </span>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            aria-label={`Ver detalhes: ${formatAuditAction(log.action)} em ${formatAuditEntityType(log.entityType)}`}
                            onClick={() => onViewDetails(log)}
                          >
                            <EyeIcon className="size-4" />
                            Ver
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <MobileCardList aria-label="Logs de auditoria">
              {logs.map((log) => {
                const variant = actionVariant(log.action);

                return (
                  <li key={log.id}>
                    {/* O card inteiro é o alvo de toque; o chevron indica que abre detalhes */}
                    <button
                      type="button"
                      onClick={() => onViewDetails(log)}
                      aria-label={`Ver detalhes: ${formatAuditAction(log.action)} em ${formatAuditEntityType(log.entityType)}`}
                      className="flex w-full items-center gap-3 rounded-lg border border-border bg-background p-4 text-left transition-colors active:bg-muted"
                    >
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={variant} category={variant}>
                            {formatAuditAction(log.action)}
                          </Badge>
                          <span className="text-sm font-medium text-foreground">
                            {formatAuditEntityType(log.entityType)}
                          </span>
                          {log.entityId ? (
                            <span className="text-xs wrap-anywhere text-muted-foreground">
                              #{log.entityId}
                            </span>
                          ) : null}
                        </div>
                        <p className="text-sm wrap-anywhere text-muted-foreground">
                          {log.user ? log.user.name : "—"}
                          {log.company ? ` · ${log.company.name}` : ""}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileDate(log.createdAt)}
                        </p>
                      </div>
                      <ChevronRight
                        aria-hidden
                        className="size-5 shrink-0 text-muted-foreground"
                      />
                    </button>
                  </li>
                );
              })}
            </MobileCardList>
          </>
        )}
      </CardContent>
    </Card>
  );
}
