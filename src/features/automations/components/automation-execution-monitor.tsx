import { useEffect, useRef } from "react";
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
  const shouldAnimateLatestLog = status === "running";
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [logs]);

  return (
    <div className="flex flex-col gap-4">
      <Progress
        value={percent}
        className="w-full justify-between gap-0 [&_[data-slot=progress-track]]:hidden"
      >
        <ProgressLabel className="text-sm font-medium text-foreground">
          Monitor de execução
        </ProgressLabel>
        <ProgressValue className="ml-0 text-sm font-medium text-foreground" />
      </Progress>

      <div
        ref={scrollContainerRef}
        className="max-h-64 space-y-3 overflow-y-auto scroll-smooth rounded-lg bg-accent p-4"
      >
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum log registrado ainda.
          </p>
        ) : (
          logs.map((log, index) => {
            const isLatestLog = index === logs.length - 1;

            return (
              <div key={log.id} className="flex items-center gap-4">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="relative inline-flex size-1.5 shrink-0">
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-0 rounded-full opacity-75",
                        badgeVariant === "error"
                          ? "bg-error"
                          : `bg-dot-${badgeVariant}-foreground`,
                        shouldAnimateLatestLog && isLatestLog && "animate-ping",
                      )}
                    />
                    <span
                      aria-hidden
                      className={cn(
                        "relative z-10 size-1.5 rounded-full",
                        badgeVariant === "error"
                          ? "bg-error"
                          : `bg-dot-${badgeVariant}-foreground`,
                      )}
                    />
                  </span>
                  <p className="text-sm text-foreground">{log.message}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
