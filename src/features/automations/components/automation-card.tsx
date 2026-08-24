import { useEffect, useMemo, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { alertToast } from "@/components/ui/sonner";
import { AutomationCardHeader } from "@/features/automations/components/automation-card-header";
import { AutomationCardMetadata } from "@/features/automations/components/automation-card-metadata";
import { AutomationExecutionMonitor } from "@/features/automations/components/automation-execution-monitor";
import {
  AutomationIdleForm,
  type AutomationStartPayload,
} from "@/features/automations/components/automation-idle-form";
import { AutomationSubmittedData } from "@/features/automations/components/automation-submitted-data";
import { useContinueExecution } from "@/features/automations/hooks/use-continue-execution";
import { useExecuteExecution } from "@/features/automations/hooks/use-execute-execution";
import { useExecutionConsoleStream } from "@/features/automations/hooks/use-execution-console-stream";
import { useExecutionFileStream } from "@/features/automations/hooks/use-execution-file-stream";
import { useFinishExecution } from "@/features/automations/hooks/use-finish-execution";
import { useSetExecutionPending } from "@/features/automations/hooks/use-set-execution-pending";
import { useStopExecution } from "@/features/automations/hooks/use-stop-execution";
import type {
  AutomationStatus,
  ExecutionListItem,
} from "@/features/automations/types/automation";
import { downloadFile } from "@/features/files/api/download-file";
import { createRuntimeFromExecution } from "@/features/automations/utils/normalize-execution";
import {
  consoleSnapshotToLogEntries,
  consoleSnapshotToProgress,
  parseConsoleSnapshot,
} from "@/features/automations/utils/parse-console-snapshot";
import { computeElapsedSeconds } from "@/features/automations/utils/format-execution-dates";

const TERMINAL_MONITOR_STATUSES: AutomationStatus[] = [
  "paused",
  "completed",
  "maintenance",
];

type AutomationCardProps = {
  execution: ExecutionListItem;
};

export function AutomationCard({ execution }: AutomationCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [submittedValues, setSubmittedValues] = useState<
    Record<string, string>
  >({});
  const executeMutation = useExecuteExecution();
  const pendingMutation = useSetExecutionPending();
  const stopMutation = useStopExecution();
  const continueMutation = useContinueExecution();
  const finishMutation = useFinishExecution();

  const [elapsedSeconds, setElapsedSeconds] = useState(() =>
    computeElapsedSeconds(execution.startedAt, execution.finishedAt),
  );

  useEffect(() => {
    const updateElapsedTime = () => {
      setElapsedSeconds(
        computeElapsedSeconds(execution.startedAt, execution.finishedAt),
      );
    };

    updateElapsedTime();

    if (execution.status !== "running" || !execution.startedAt) {
      return;
    }

    const intervalId = window.setInterval(updateElapsedTime, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [execution.status, execution.startedAt, execution.finishedAt]);

  const stream = useExecutionConsoleStream({
    executionId: execution.executionId,
    status: execution.status,
    enabled: execution.status === "running",
    accumulateLogs: isOpen,
  });

  const { resetMonitor } = stream;

  const fileStream = useExecutionFileStream({
    executionId: execution.executionId,
    status: execution.status,
    enabled:
      execution.status === "running" ||
      execution.status === "paused" ||
      execution.status === "completed",
  });

  const staticConsole = useMemo(() => {
    if (
      !TERMINAL_MONITOR_STATUSES.includes(execution.status) ||
      !execution.dataConsole
    ) {
      return null;
    }

    const snapshot = parseConsoleSnapshot(execution.dataConsole);

    return {
      logs: consoleSnapshotToLogEntries(
        snapshot,
        execution.finishedAt ?? execution.startedAt ?? undefined,
      ),
      ...consoleSnapshotToProgress(snapshot),
    };
  }, [
    execution.status,
    execution.dataConsole,
    execution.finishedAt,
    execution.startedAt,
  ]);

  const runtime = useMemo(
    () => ({
      ...createRuntimeFromExecution(execution),
      elapsedSeconds,
      logs:
        execution.status === "running"
          ? stream.logs
          : (staticConsole?.logs ?? []),
      processed:
        execution.status === "running"
          ? stream.processed
          : (staticConsole?.processed ?? 0),
      total:
        execution.status === "running"
          ? stream.total
          : (staticConsole?.total ?? 0),
      status: stream.status ?? execution.status,
      submittedValues,
      outputFile: fileStream.outputFile,
    }),
    [
      execution,
      elapsedSeconds,
      stream,
      staticConsole,
      submittedValues,
      fileStream.outputFile,
    ],
  );

  function handleAction() {
    switch (runtime.status) {
      case "idle":
        setIsOpen(true);
        break;
      case "running":
        stopMutation.mutate({ executionId: execution.executionId });
        break;
      case "paused":
        continueMutation.mutate({ executionId: execution.executionId });
        break;
      case "completed":
        pendingMutation.mutate(
          { executionId: execution.executionId },
          {
            onSuccess: () => {
              resetMonitor();
              setSubmittedValues({});
              setIsOpen(true);
            },
          },
        );
        break;
      default:
        alertToast.info(
          "Em desenvolvimento",
          "Esta ação estará disponível em breve.",
        );
        break;
    }
  }

  function handleStart({ formData, displayValues }: AutomationStartPayload) {
    executeMutation.mutate(
      {
        executionId: execution.executionId,
        formData,
        displayValues,
      },
      {
        onSuccess: () => {
          resetMonitor();
          setSubmittedValues(displayValues);
          setIsOpen(true);
        },
      },
    );
  }

  function handleCancel() {
    finishMutation.mutate(
      { executionId: execution.executionId },
      {
        onSuccess: () => {
          resetMonitor();
          setSubmittedValues({});
          setIsOpen(false);
        },
      },
    );
  }

  function handleDownload() {
    const token = runtime.outputFile?.token;
    if (!token) {
      return;
    }

    downloadFile(token);
  }

  const isActionPending =
    stopMutation.isPending ||
    continueMutation.isPending ||
    pendingMutation.isPending;

  const isIdle = runtime.status === "idle";
  const contentLayoutClassName = isIdle
    ? "flex flex-col gap-4 lg:flex-row lg:flex-wrap"
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
        isActionPending={isActionPending}
      />

      <CollapsibleContent
        keepMounted
        className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-starting-style:h-0 data-ending-style:h-0 [&[hidden]:not([hidden='until-found'])]:hidden"
      >
        <CardContent
          className={`border-t border-border py-6 ${contentLayoutClassName} ${isIdle ? "" : "lg:items-stretch"}`}
        >
          <div className="min-w-0 shrink-0 lg:w-55 lg:self-stretch">
            <AutomationCardMetadata
              categorySlug={execution.categorySlug}
              categoryLabel={execution.categoryLabel}
              runtime={runtime}
            />
          </div>

          {isIdle ? (
            <>
              <div className="min-w-0 flex-1 border-l border-border pl-4">
                <AutomationIdleForm
                  fields={execution.fields}
                  isSubmitting={executeMutation.isPending}
                  onStart={handleStart}
                />
              </div>
              <div className="min-w-0 shrink-0 lg:w-55 lg:self-stretch"></div>
            </>
          ) : (
            <>
              <div className="min-w-0 flex-1 lg:border-x lg:border-border lg:px-4">
                <AutomationExecutionMonitor
                  processed={runtime.processed}
                  total={runtime.total}
                  logs={runtime.logs}
                  status={runtime.status}
                />
              </div>
              <div className="min-w-0 shrink-0 lg:w-55 lg:self-stretch">
                <AutomationSubmittedData
                  status={runtime.status}
                  submittedValues={runtime.submittedValues}
                  outputFile={runtime.outputFile}
                  isLoadingFile={fileStream.isLoadingFile}
                  isCancelPending={finishMutation.isPending}
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
