import { AUTOMATION_STATUS_CONFIG } from "@/features/automations/config/automation-status";
import type { AutomationStatus } from "@/features/automations/types/automation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type AutomationStatusBadgeProps = {
  status: AutomationStatus;
  className?: string;
};

export function AutomationStatusBadge({
  status,
  className,
}: AutomationStatusBadgeProps) {
  const config = AUTOMATION_STATUS_CONFIG[status];

  return (
    <Badge
      variant={config.badgeVariant}
      category={config.badgeVariant}
      className={cn(
        "w-fit",
        className,
        status === "running" && "[&_[data-slot=badge-dot]]:animate-ping",
      )}
    >
      {config.label}
    </Badge>
  );
}
