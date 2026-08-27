import { useQueryClient } from "@tanstack/react-query";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";

import { executionsQueryKeys } from "@/features/automations/hooks/executions-query-keys";
import { useExecutionDetail } from "@/features/automations/hooks/use-execution-detail";
import { filesQueryKeys } from "@/features/files/hooks/files-query-keys";
import type {
  AutomationLogEntry,
  AutomationStatus,
  ExecutionApiResponse,
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
import {
  isTerminalApiStatus,
  mapExecutionStatus,
} from "@/features/automations/utils/map-execution-status";
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
  startedAt?: string | null;
  enabled: boolean;
  accumulateLogs?: boolean;
};

type ExecutionConsoleStreamState = {
  logs: AutomationLogEntry[];
  processed: number;
  total: number;
  status?: AutomationStatus;
  finishedAt: string | null;
  connectionState: SseConnectionState;
  resetMonitor: () => void;
};

const TERMINAL_STATUSES: AutomationStatus[] = [
  "completed",
  "paused",
  "idle",
  "maintenance",
];

const RUNNING_POLL_INTERVAL_MS = 2_000;

function isTerminalStatus(status: AutomationStatus): boolean {
  return TERMINAL_STATUSES.includes(status);
}

function invalidateListOnTerminalStatus(
  queryClient: ReturnType<typeof useQueryClient>,
  mappedStatus: AutomationStatus,
): void {
  if (!isTerminalStatus(mappedStatus)) {
    return;
  }

  void queryClient.invalidateQueries({
    queryKey: executionsQueryKeys.all,
  });

  if (mappedStatus === "completed") {
    void queryClient.invalidateQueries({
      queryKey: filesQueryKeys.all,
    });
  }
}

function applyStatusTransition(
  queryClient: ReturnType<typeof useQueryClient>,
  previousStatusRef: MutableRefObject<AutomationStatus | undefined>,
  mappedStatus: AutomationStatus,
  onStatusChange: (status: AutomationStatus) => void,
): void {
  const previousStatus = previousStatusRef.current;

  if (previousStatus !== mappedStatus) {
    onStatusChange(mappedStatus);

    if (
      previousStatus != null &&
      !isTerminalStatus(previousStatus) &&
      isTerminalStatus(mappedStatus)
    ) {
      invalidateListOnTerminalStatus(queryClient, mappedStatus);
    }

    previousStatusRef.current = mappedStatus;
  }
}

export function useExecutionConsoleStream({
  executionId,
  status,
  startedAt = null,
  enabled,
  accumulateLogs = true,
}: UseExecutionConsoleStreamOptions): ExecutionConsoleStreamState {
  const queryClient = useQueryClient();
  const [logs, setLogs] = useState<AutomationLogEntry[]>([]);
  const [processed, setProcessed] = useState(0);
  const [total, setTotal] = useState(0);
  const [streamStatus, setStreamStatus] = useState<
    AutomationStatus | undefined
  >(undefined);
  const seededUpdatedAtRef = useRef<string | null>(null);
  const prevAccumulateLogsRef = useRef(accumulateLogs);
  const previousStatusRef = useRef<AutomationStatus | undefined>(undefined);
  const accumulateLogsRef = useRef(accumulateLogs);

  accumulateLogsRef.current = accumulateLogs;

  const detailQueryKey = useMemo(
    () => [...executionsQueryKeys.all, "detail", executionId] as const,
    [executionId],
  );

  const cachedDetail =
    queryClient.getQueryData<ExecutionApiResponse>(detailQueryKey);

  const detailTerminal =
    cachedDetail != null &&
    isTerminalApiStatus(cachedDetail.status) &&
    (startedAt == null || cachedDetail.startedAt === startedAt);

  const detailEnabled = enabled && !detailTerminal;

  const sseProgressStartedRef = useRef(false);
  const progressStartedFromStream = processed > 0 || total > 0;

  useEffect(() => {
    sseProgressStartedRef.current = progressStartedFromStream;
  }, [progressStartedFromStream]);

  const { data: executionDetail, refetch } = useExecutionDetail(
    executionId,
    detailEnabled,
    {
      refetchInterval: (query) => {
        if (!detailEnabled) {
          return false;
        }

        const detailStatus = query.state.data?.status;
        if (detailStatus && isTerminalApiStatus(detailStatus)) {
          return false;
        }

        if (progressStartedFromStream || sseProgressStartedRef.current) {
          return false;
        }

        const dataConsole = query.state.data?.dataConsole;
        if (dataConsole) {
          const progress = consoleSnapshotToProgress(
            parseConsoleSnapshot(dataConsole),
          );
          if (progress.processed > 0 || progress.total > 0) {
            return false;
          }
        }

        return RUNNING_POLL_INTERVAL_MS;
      },
    },
  );

  const enqueueLog = useCallback((entry: AutomationLogEntry) => {
    setLogs((current) => appendLogEntry(current, entry));
  }, []);

  const resetMonitor = useCallback(() => {
    seededUpdatedAtRef.current = null;
    prevAccumulateLogsRef.current = accumulateLogs;
    previousStatusRef.current = undefined;
    setLogs([]);
    setProcessed(0);
    setTotal(0);
    setStreamStatus(undefined);
  }, [accumulateLogs]);

  useEffect(() => {
    if (!detailEnabled || !executionDetail) {
      return;
    }

    const mappedStatus = mapExecutionStatus(executionDetail.status);
    applyStatusTransition(
      queryClient,
      previousStatusRef,
      mappedStatus,
      setStreamStatus,
    );

    if (seededUpdatedAtRef.current === executionDetail.updatedAt) {
      return;
    }

    seededUpdatedAtRef.current = executionDetail.updatedAt;

    if (accumulateLogs) {
      if (executionDetail.dataConsole) {
        const snapshot = parseConsoleSnapshot(executionDetail.dataConsole);
        setLogs(
          consoleSnapshotToLogEntries(snapshot, executionDetail.updatedAt),
        );
        const progress = consoleSnapshotToProgress(snapshot);
        setProcessed(progress.processed);
        setTotal(progress.total);
      } else {
        setLogs([]);
        setProcessed(0);
        setTotal(0);
      }
    }
  }, [accumulateLogs, detailEnabled, executionDetail, queryClient]);

  useEffect(() => {
    if (!detailEnabled || !accumulateLogs) {
      if (!accumulateLogs) {
        setLogs([]);
        prevAccumulateLogsRef.current = false;
      }
      return;
    }

    if (prevAccumulateLogsRef.current) {
      return;
    }

    prevAccumulateLogsRef.current = true;

    void refetch().then(({ data }) => {
      if (!data) {
        return;
      }

      seededUpdatedAtRef.current = data.updatedAt;
      applyStatusTransition(
        queryClient,
        previousStatusRef,
        mapExecutionStatus(data.status),
        setStreamStatus,
      );

      if (!data.dataConsole) {
        setLogs([]);
        return;
      }

      const snapshot = parseConsoleSnapshot(data.dataConsole);
      setLogs(consoleSnapshotToLogEntries(snapshot, data.updatedAt));
    });
  }, [accumulateLogs, detailEnabled, refetch, queryClient]);

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
        if (accumulateLogsRef.current) {
          const entry = mapSseToLogEntry(event.data, event.timestamp);
          enqueueLog(entry);
        }

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
        applyStatusTransition(
          queryClient,
          previousStatusRef,
          mappedStatus,
          setStreamStatus,
        );
      }
    },
    [enqueueLog, queryClient],
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
    finishedAt: executionDetail?.finishedAt ?? cachedDetail?.finishedAt ?? null,
    connectionState: sseEnabled ? connectionState : "idle",
    resetMonitor,
  };
}
