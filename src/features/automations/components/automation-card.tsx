import { useMemo, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { alertToast } from "@/components/ui/sonner";
import { AutomationCardHeader } from "@/features/automations/components/automation-card-header";
import { AutomationCardMetadata } from "@/features/automations/components/automation-card-metadata";
import { AutomationExecutionMonitor } from "@/features/automations/components/automation-execution-monitor";
import { AutomationIdleForm } from "@/features/automations/components/automation-idle-form";
import { AutomationSubmittedData } from "@/features/automations/components/automation-submitted-data";
import type { ExecutionListItem } from "@/features/automations/types/automation";
import { createRuntimeFromExecution } from "@/features/automations/utils/normalize-execution";

type AutomationCardProps = {
  execution: ExecutionListItem;
};

export function AutomationCard({ execution }: AutomationCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const runtime = useMemo(
    () => createRuntimeFromExecution(execution),
    [execution],
  );

  function handleAction() {
    switch (runtime.status) {
      case "idle":
        setIsOpen(true);
        break;
      default:
        alertToast.info(
          "Em desenvolvimento",
          "Esta ação estará disponível em breve.",
        );
        break;
    }
  }

  function handleStart() {
    alertToast.info(
      "Em desenvolvimento",
      "A execução estará disponível em breve.",
    );
    setIsOpen(true);
  }

  function handleCancel() {
    alertToast.info(
      "Em desenvolvimento",
      "Esta ação estará disponível em breve.",
    );
    setIsOpen(false);
  }

  function handleDownload() {
    alertToast.info(
      "Em desenvolvimento",
      "O download estará disponível em breve.",
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
        execution={execution}
        runtime={runtime}
        onAction={handleAction}
      />

      <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-starting-style:h-0 data-ending-style:h-0 [&[hidden]:not([hidden='until-found'])]:hidden">
        <CardContent
          className={`border-t border-border py-6 ${contentLayoutClassName}`}
        >
          <div className="min-w-0 lg:w-55 lg:flex-none">
            <AutomationCardMetadata
              categorySlug={execution.categorySlug}
              categoryLabel={execution.categoryLabel}
              runtime={runtime}
            />
          </div>

          {isIdle ? (
            <div className="min-w-0 lg:flex-1 border-l border-border pl-4">
              <AutomationIdleForm
                fields={execution.fields}
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
