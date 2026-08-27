import { EyeIcon } from "lucide-react";

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
          <div className="space-y-3">
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
                          <span className="font-medium">{log.user.name}</span>
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
        )}
      </CardContent>
    </Card>
  );
}
