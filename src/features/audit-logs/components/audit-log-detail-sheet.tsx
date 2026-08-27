import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  AuditChanges,
  AuditDiffEntry,
  AuditLogItem,
} from "@/features/audit-logs/types/audit-log";
import {
  formatAuditAction,
  formatAuditEntityType,
  formatAuditValue,
} from "@/features/audit-logs/utils/format-audit-action";
import { formatFileDate } from "@/features/files/utils/format-file-date";

type AuditLogDetailSheetProps = {
  log: AuditLogItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function isUpdateChanges(changes: AuditChanges): changes is {
  before: unknown;
  after: unknown;
  diff: Record<string, AuditDiffEntry> | null;
} {
  return "diff" in changes;
}

function DiffTable({ diff }: { diff: Record<string, AuditDiffEntry> }) {
  const entries = Object.entries(diff);

  if (entries.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhuma diferença detectada entre os estados.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campo</TableHead>
            <TableHead>Antes</TableHead>
            <TableHead>Depois</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map(([field, entry]) => (
            <TableRow key={field}>
              <TableCell className="font-mono text-xs">{field}</TableCell>
              <TableCell className="max-w-40 whitespace-pre-wrap break-all text-xs">
                {formatAuditValue(entry.from)}
              </TableCell>
              <TableCell className="max-w-40 whitespace-pre-wrap break-all text-xs">
                {formatAuditValue(entry.to)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function SnapshotBlock({ title, value }: { title: string; value: unknown }) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">{title}</h4>
      <pre className="max-h-64 overflow-auto rounded-md border bg-muted/30 p-3 text-xs whitespace-pre-wrap break-all">
        {formatAuditValue(value)}
      </pre>
    </div>
  );
}

export function AuditLogDetailSheet({
  log,
  open,
  onOpenChange,
}: AuditLogDetailSheetProps) {
  if (!log) {
    return null;
  }

  const actionVariant =
    log.action === "CREATE"
      ? "success"
      : log.action === "DELETE"
        ? "error"
        : "info";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Detalhes da auditoria</SheetTitle>
          <SheetDescription>
            {formatFileDate(log.createdAt)} ·{" "}
            {log.user ? `${log.user.name} (${log.user.email})` : "Sistema"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={actionVariant} category={actionVariant}>
              {formatAuditAction(log.action)}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {formatAuditEntityType(log.entityType)}
              {log.entityId ? ` · #${log.entityId}` : ""}
            </span>
          </div>

          {log.company ? (
            <p className="text-sm">
              <span className="text-muted-foreground">Empresa:</span>{" "}
              {log.company.name}
            </p>
          ) : null}

          {!log.changes ? (
            <p className="text-sm text-muted-foreground">
              Nenhum detalhe registrado para esta ação.
            </p>
          ) : log.action === "UPDATE" && isUpdateChanges(log.changes) ? (
            <DiffTable diff={log.changes.diff ?? {}} />
          ) : log.action === "CREATE" && "after" in log.changes ? (
            <SnapshotBlock title="Registro criado" value={log.changes.after} />
          ) : log.action === "DELETE" && "before" in log.changes ? (
            <SnapshotBlock
              title="Registro removido"
              value={log.changes.before}
            />
          ) : (
            <SnapshotBlock title="Alterações" value={log.changes} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
