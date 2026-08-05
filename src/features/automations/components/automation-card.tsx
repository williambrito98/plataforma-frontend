import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { alertToast } from "@/components/ui/sonner";
import { AutomationCardHeader } from "@/features/automations/components/automation-card-header";
import { AutomationCardMetadata } from "@/features/automations/components/automation-card-metadata";
import { AutomationExecutionMonitor } from "@/features/automations/components/automation-execution-monitor";
import { AutomationIdleForm } from "@/features/automations/components/automation-idle-form";
import { AutomationSubmittedData } from "@/features/automations/components/automation-submitted-data";
import {
  useAutomationRuntime,
  useAutomationsRuntimeStore,
} from "@/features/automations/stores/automations-runtime-store";
import type { AutomationListItem } from "@/features/automations/types/automation";

type AutomationCardProps = {
  automation: AutomationListItem;
};

export function AutomationCard({ automation }: AutomationCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const runtime = useAutomationRuntime(automation.id);
  const start = useAutomationsRuntimeStore((state) => state.start);
  const restart = useAutomationsRuntimeStore((state) => state.restart);
  const pause = useAutomationsRuntimeStore((state) => state.pause);
  const resume = useAutomationsRuntimeStore((state) => state.resume);
  const cancel = useAutomationsRuntimeStore((state) => state.cancel);

  function handleAction() {
    switch (runtime.status) {
      case "idle":
        setIsOpen(true);
        break;
      case "running":
        pause(automation.id);
        break;
      case "paused":
        resume(automation.id);
        break;
      case "maintenance":
        alertToast.info(
          "Reportar problema",
          "Funcionalidade em desenvolvimento.",
        );
        break;
      case "completed":
        restart(automation.id);
        break;
    }
  }

  function handleStart(submittedValues: Record<string, string>) {
    start(automation.id, submittedValues, automation.defaultTotal);
    setIsOpen(true);
  }

  function handleCancel() {
    cancel(automation.id);
    setIsOpen(false);
  }

  function handleDownload() {
    if (!runtime.outputFile) {
      return;
    }

    alertToast.success(
      "Download iniciado",
      `Baixando ${runtime.outputFile.name}...`,
    );
  }

  const isIdle = runtime.status === "idle";
  const contentLayoutClassName = isIdle
    ? "flex flex-col gap-4 lg:flex-row lg:flex-nowrap"
    : "flex flex-col gap-4 lg:flex-row lg:flex-nowrap";

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      render={<Card className="group/card relative gap-0 py-0" />}
    >
      <AutomationCardHeader
        automation={automation}
        runtime={runtime}
        onAction={handleAction}
      />

      <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-starting-style:h-0 data-ending-style:h-0 [&[hidden]:not([hidden='until-found'])]:hidden">
        <CardContent
          className={`border-t border-border py-6 ${contentLayoutClassName}`}
        >
          <div className="min-w-0 lg:w-55 lg:flex-none">
            <AutomationCardMetadata
              category={automation.category}
              categoryLabel={automation.categoryLabel}
              runtime={runtime}
            />
          </div>

          {isIdle ? (
            <div className="min-w-0 lg:flex-1 border-l border-border pl-4">
              <AutomationIdleForm
                fields={automation.fields}
                onStart={handleStart}
              />
            </div>
          ) : (
            <>
              <div className="flex min-h-0 min-w-0 flex-col lg:flex-1 lg:border-x lg:border-border lg:px-4">
                <AutomationExecutionMonitor
                  processed={runtime.processed}
                  total={runtime.total}
                  logs={runtime.logs}
                  status={runtime.status}
                />
              </div>
              <div className="min-w-0 lg:w-55 lg:flex-none">
                <AutomationSubmittedData
                  status={runtime.status}
                  submittedValues={runtime.submittedValues}
                  outputFile={runtime.outputFile}
                  onCancel={handleCancel}
                  onDownload={handleDownload}
                />
              </div>
            </>
          )}
        </CardContent>
      </CollapsibleContent>
    </Collapsible>
  );
}
