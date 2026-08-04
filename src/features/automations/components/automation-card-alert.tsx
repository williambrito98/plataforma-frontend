import { AUTOMATION_STATUS_CONFIG } from "@/features/automations/config/automation-status";
import type {
  AutomationRuntime,
  AutomationStatus,
} from "@/features/automations/types/automation";
import { cn } from "@/lib/utils";

type AutomationCardAlertProps = {
  status: AutomationStatus;
  runtime: AutomationRuntime;
  className?: string;
};

function getAlertTexts(status: AutomationStatus, runtime: AutomationRuntime) {
  const config = AUTOMATION_STATUS_CONFIG[status];

  if (status === "maintenance") {
    return {
      title: config.alertTitle,
      subtitle: runtime.errorMessage ?? config.alertSubtitle,
    };
  }

  if (status === "running" || status === "paused") {
    return {
      title: config.alertTitle,
      subtitle:
        runtime.total > 0
          ? `${runtime.processed} de ${runtime.total} transmitidas`
          : config.alertSubtitle,
    };
  }

  return {
    title: config.alertTitle,
    subtitle: config.alertSubtitle,
  };
}

function getProgressPercent(runtime: AutomationRuntime): number | null {
  if (runtime.total <= 0) return null;
  return Math.round((runtime.processed / runtime.total) * 100);
}

function getAlertColorClass(status: AutomationStatus) {
  switch (status) {
    case "running":
      return "text-info-foreground";
    case "paused":
      return "text-warning-foreground";
    case "maintenance":
      return "text-error-foreground";
    default:
      return "text-success-foreground";
  }
}

export function AutomationCardAlert({
  status,
  runtime,
  className,
}: AutomationCardAlertProps) {
  const config = AUTOMATION_STATUS_CONFIG[status];
  const Icon = config.icon;
  const { title, subtitle } = getAlertTexts(status, runtime);
  const percent = getProgressPercent(runtime);
  const showPercent =
    percent !== null && (status === "running" || status === "paused");

  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 items-start gap-3 border-l border-border pl-4",
        className,
      )}
    >
      <div className="flex shrink-0 items-center gap-1.5">
        <Icon
          aria-hidden
          className={cn(
            "mt-0.5 size-4 shrink-0",
            getAlertColorClass(status),
            config.spinIcon ? "animate-spin" : undefined,
          )}
        />
        {showPercent ? (
          <span
            className={cn(
              "text-sm font-medium tabular-nums",
              getAlertColorClass(status),
            )}
          >
            {percent}%
          </span>
        ) : null}
      </div>
      <div className="min-w-0 space-y-1">
        <p className={cn("text-sm font-medium", getAlertColorClass(status))}>
          {title}
        </p>
        <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
