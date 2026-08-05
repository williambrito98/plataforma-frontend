import { CollapsibleTrigger } from "@/components/ui/collapsible";
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
      title:
        runtime.total > 0
          ? `${runtime.processed} de ${runtime.total} encontrados`
          : config.alertSubtitle,
      subtitle: config.alertSubtitle,
    };
  }

  if (status === "completed") {
    return {
      title:
        runtime.total > 0
          ? `${runtime.processed} de ${runtime.total} transmitidas`
          : config.alertTitle,
      subtitle: config.alertSubtitle,
    };
  }

  return {
    title: config.alertTitle,
    subtitle: config.alertSubtitle,
  };
}

function getAlertColorClass(status: AutomationStatus) {
  switch (status) {
    case "running":
      return "text-blue-600";
    case "paused":
      return "text-warning-foreground";
    case "maintenance":
      return "text-error-foreground";
    case "completed":
      return "text-success-foreground";
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

  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 items-start gap-3 border-l border-border pl-4",
        className,
      )}
    >
      <Icon
        aria-hidden
        className={cn(
          "mt-0.5 size-4 shrink-0",
          getAlertColorClass(status),
          config.spinIcon ? "animate-spin" : undefined,
        )}
      />
      <div className="min-w-0 space-y-1">
        <p className={cn("text-sm font-medium", getAlertColorClass(status))}>
          {title}
        </p>
        <CollapsibleTrigger
          nativeButton={true}
          render={
            <button
              type="button"
              className="truncate text-left text-sm text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            ></button>
          }
        >
          {subtitle}
        </CollapsibleTrigger>
      </div>
    </div>
  );
}
