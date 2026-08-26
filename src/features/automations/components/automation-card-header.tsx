import { ChevronDown, Pencil } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { AUTOMATION_STATUS_CONFIG } from "@/features/automations/config/automation-status";
import { AutomationCardAlert } from "@/features/automations/components/automation-card-alert";
import { AutomationStatusBadge } from "@/features/automations/components/automation-status-badge";
import { PermissionCodes } from "@/features/auth/constants/permissions";
import { useCan } from "@/features/auth/hooks/use-can";
import type {
  AutomationRuntime,
  ExecutionListItem,
} from "@/features/automations/types/automation";

type AutomationCardHeaderProps = {
  execution: ExecutionListItem;
  runtime: AutomationRuntime;
  onAction: () => void;
  isActionPending?: boolean;
};

export function AutomationCardHeader({
  execution,
  runtime,
  onAction,
  isActionPending = false,
}: AutomationCardHeaderProps) {
  const canEdit = useCan(PermissionCodes.AUTOMATIONS_UPDATE);
  const config = AUTOMATION_STATUS_CONFIG[runtime.status];
  const ActionIcon = config.action.icon;
  const ProgressBarColor = config.progressBarColor;

  return (
    <div className="relative px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="flex w-55 shrink-0 flex-col gap-1">
          <h3 className="truncate font-medium text-foreground">
            {execution.name}
          </h3>
          <AutomationStatusBadge status={runtime.status} />
        </div>

        <AutomationCardAlert status={runtime.status} runtime={runtime} />

        <div className="flex w-40 shrink-0 items-center justify-end gap-2">
          {canEdit ? (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Editar automação"
              render={
                <Link
                  to="/automacoes/$id/editar"
                  params={{ id: execution.automationId }}
                />
              }
              nativeButton={false}
            >
              <Pencil className="size-4" aria-hidden />
            </Button>
          ) : null}

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
            disabled={isActionPending}
            loading={isActionPending}
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
          indicatorClassName={ProgressBarColor}
          className="absolute inset-x-0 bottom-0 gap-0 **:data-[slot=progress-track]:h-0.5 **:data-[slot=progress-track]:rounded-none **:data-[slot=progress-track]:bg-border"
        />
      ) : null}
    </div>
  );
}
