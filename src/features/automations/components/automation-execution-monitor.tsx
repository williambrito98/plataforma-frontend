import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import type {
  AutomationLogEntry,
  AutomationStatus,
} from "@/features/automations/types/automation";
import { cn } from "@/lib/utils";
import { AUTOMATION_STATUS_CONFIG } from "../config/automation-status";

type AutomationExecutionMonitorProps = {
  status: AutomationStatus;
  processed: number;
  total: number;
  logs: AutomationLogEntry[];
};

export function AutomationExecutionMonitor({
  status,
  processed,
  total,
  logs,
}: AutomationExecutionMonitorProps) {
  const percent = total > 0 ? (processed / total) * 100 : 0;
  const config = AUTOMATION_STATUS_CONFIG[status];
  const badgeVariant = config.badgeVariant;

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-4">
      <Progress
        value={percent}
        className="w-full justify-between gap-0 [&_[data-slot=progress-track]]:hidden"
      >
        <ProgressLabel className="text-sm font-medium text-foreground">
          Monitor de execução
        </ProgressLabel>
        <ProgressValue className="ml-0 text-sm font-medium text-foreground" />
      </Progress>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto rounded-lg bg-accent p-4">
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum log registrado ainda.
          </p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-center gap-4">
              <p className="text-xs text-muted-foreground">{log.time}</p>
              <div className="flex items-center gap-2 min-w-0">
                <span
                  aria-hidden
                  className={cn(
                    "size-2 shrink-0 rounded-full",
                    badgeVariant === "error"
                      ? "bg-error"
                      : `bg-dot-${badgeVariant}-foreground`,
                  )}
                />
                <p className="text-sm text-foreground">{log.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
