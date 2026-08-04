import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { AUTOMATION_STATUS_CONFIG } from "@/features/automations/config/automation-status";
import { AutomationCardAlert } from "@/features/automations/components/automation-card-alert";
import { AutomationStatusBadge } from "@/features/automations/components/automation-status-badge";
import type {
  AutomationListItem,
  AutomationRuntime,
} from "@/features/automations/types/automation";

type AutomationCardHeaderProps = {
  automation: AutomationListItem;
  runtime: AutomationRuntime;
  onAction: () => void;
};

export function AutomationCardHeader({
  automation,
  runtime,
  onAction,
}: AutomationCardHeaderProps) {
  const config = AUTOMATION_STATUS_CONFIG[runtime.status];
  const ActionIcon = config.action.icon;

  return (
    <div className="relative px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="flex w-55 shrink-0 flex-col gap-1">
          <h3 className="truncate font-medium text-foreground">
            {automation.name}
          </h3>
          <AutomationStatusBadge status={runtime.status} />
        </div>

        <AutomationCardAlert status={runtime.status} runtime={runtime} />

        <div className="flex w-40 shrink-0 items-center justify-end gap-2">
          <CollapsibleTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Expandir card"
              />
            }
          >
            <ChevronDown className="size-4 transition-transform duration-200 ease-in-out group-data-open/card:rotate-180" />
          </CollapsibleTrigger>

          <Button
            variant="outline"
            size="sm"
            onClick={onAction}
            className={"w-28"}
          >
            <ActionIcon aria-hidden />
            {config.action.label}
          </Button>
        </div>
      </div>

      {config.showProgress ? (
        <Progress
          value={
            runtime.total > 0 ? (runtime.processed / runtime.total) * 100 : null
          }
          aria-label="Progresso da execução"
          className="absolute inset-x-0 bottom-0 gap-0 **:data-[slot=progress-track]:h-0.5 **:data-[slot=progress-track]:rounded-none **:data-[slot=progress-track]:bg-border **:data-[slot=progress-indicator]:bg-info-foreground"
        />
      ) : null}
    </div>
  );
}
