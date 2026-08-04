import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import type { AutomationLogEntry } from "@/features/automations/types/automation";
import { cn } from "@/lib/utils";

type AutomationExecutionMonitorProps = {
  processed: number;
  total: number;
  logs: AutomationLogEntry[];
};

export function AutomationExecutionMonitor({
  processed,
  total,
  logs,
}: AutomationExecutionMonitorProps) {
  const percent = total > 0 ? (processed / total) * 100 : 0;

  return (
    <div className="space-y-4">
      <Progress
        value={percent}
        className="w-full justify-between gap-0 [&_[data-slot=progress-track]]:hidden"
      >
        <ProgressLabel className="text-sm font-medium text-foreground">
          Monitor de execução
        </ProgressLabel>
        <ProgressValue className="ml-0 text-sm font-medium text-foreground" />
      </Progress>

      <div className="max-h-48 space-y-3 overflow-y-auto rounded-lg bg-accent p-4">
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum log registrado ainda.
          </p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-start gap-3">
              <span
                aria-hidden
                className={cn(
                  "mt-1.5 size-2 shrink-0 rounded-full",
                  log.variant === "error" ? "bg-error" : "bg-info-foreground",
                )}
              />
              <div className="min-w-0 space-y-0.5">
                <p className="text-xs text-muted-foreground">{log.time}</p>
                <p className="text-sm text-foreground">{log.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
