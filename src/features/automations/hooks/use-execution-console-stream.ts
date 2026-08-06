import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { executionsQueryKeys } from "@/features/automations/hooks/executions-query-keys";
import { useExecutionDetail } from "@/features/automations/hooks/use-execution-detail";
import type {
  AutomationLogEntry,
  AutomationStatus,
} from "@/features/automations/types/automation";
import {
  isConsoleSseEvent,
  isExecutionStatusSseEvent,
} from "@/features/automations/types/sse-events";
import {
  appendLogEntry,
  extractProgressFromPayload,
  mapSseToLogEntry,
} from "@/features/automations/utils/map-sse-to-log-entry";
import { mapExecutionStatus } from "@/features/automations/utils/map-execution-status";
import {
  consoleSnapshotToLogEntries,
  consoleSnapshotToProgress,
  parseConsoleSnapshot,
} from "@/features/automations/utils/parse-console-snapshot";
import { useSse } from "@/hooks/use-sse";
import { buildSseUrl } from "@/lib/sse/build-sse-url";
import { parseSseData } from "@/lib/sse/parse-sse-data";
import type { SseConnectionState, SseEventEnvelope } from "@/lib/sse/types";

type UseExecutionConsoleStreamOptions = {
  executionId: string;
  status: AutomationStatus;
  enabled: boolean;
};

type ExecutionConsoleStreamState = {
  logs: AutomationLogEntry[];
  processed: number;
  total: number;
  status?: AutomationStatus;
  connectionState: SseConnectionState;
};

const TERMINAL_STATUSES: AutomationStatus[] = [
  "completed",
  "paused",
  "idle",
  "maintenance",
];

function isTerminalStatus(status: AutomationStatus): boolean {
  return TERMINAL_STATUSES.includes(status);
}

export function useExecutionConsoleStream({
  executionId,
  status,
  enabled,
}: UseExecutionConsoleStreamOptions): ExecutionConsoleStreamState {
  const queryClient = useQueryClient();
  const [logs, setLogs] = useState<AutomationLogEntry[]>([]);
  const [processed, setProcessed] = useState(0);
  const [total, setTotal] = useState(0);
  const [streamStatus, setStreamStatus] = useState<
    AutomationStatus | undefined
  >(undefined);
  const seededExecutionIdRef = useRef<string | null>(null);

  const shouldLoadHistory = enabled || !isTerminalStatus(status);
  const { data: executionDetail } = useExecutionDetail(
    executionId,
    shouldLoadHistory && status !== "idle",
  );

  useEffect(() => {
    if (!executionDetail?.dataConsole) {
      return;
    }

    if (seededExecutionIdRef.current === executionId) {
      return;
    }

    const snapshot = parseConsoleSnapshot(executionDetail.dataConsole);
    const progress = consoleSnapshotToProgress(snapshot);

    seededExecutionIdRef.current = executionId;
    setLogs(consoleSnapshotToLogEntries(snapshot, executionDetail.updatedAt));
    setProcessed(progress.processed);
    setTotal(progress.total);
  }, [executionDetail, executionId]);

  useEffect(() => {
    if (status === "idle") {
      seededExecutionIdRef.current = null;
      setLogs([]);
      setProcessed(0);
      setTotal(0);
      setStreamStatus(undefined);
    }
  }, [status, executionId]);

  const sseEnabled = enabled && status === "running";

  const sseUrl = useMemo(
    () => (sseEnabled ? buildSseUrl(`/events/console/${executionId}`) : null),
    [sseEnabled, executionId],
  );

  const handleSseEvent = useCallback(
    (event: SseEventEnvelope) => {
      if (event.type === "heartbeat") {
        return;
      }

      if (isConsoleSseEvent(event)) {
        const entry = mapSseToLogEntry(event.data, event.timestamp);
        setLogs((current) => appendLogEntry(current, entry));

        const progress = extractProgressFromPayload(event.data);
        if (progress.processed != null) {
          setProcessed(progress.processed);
        }
        if (progress.total != null) {
          setTotal(progress.total);
        }
        return;
      }

      if (isExecutionStatusSseEvent(event)) {
        const mappedStatus = mapExecutionStatus(event.data.status);
        setStreamStatus(mappedStatus);

        if (isTerminalStatus(mappedStatus)) {
          void queryClient.invalidateQueries({
            queryKey: executionsQueryKeys.all,
          });
        }
      }
    },
    [queryClient],
  );

  const { connectionState } = useSse<SseEventEnvelope>(sseUrl, {
    enabled: sseEnabled,
    parse: parseSseData,
    onEvent: handleSseEvent,
  });

  return {
    logs,
    processed,
    total,
    status: streamStatus,
    connectionState: sseEnabled ? connectionState : "idle",
  };
}
