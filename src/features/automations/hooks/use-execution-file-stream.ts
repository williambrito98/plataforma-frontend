import { useCallback, useEffect, useMemo, useState } from "react";

import { getExecutionFiles } from "@/features/automations/api/get-execution-files";
import type {
  AutomationRuntime,
  AutomationStatus,
} from "@/features/automations/types/automation";
import { isUploadFileSseEvent } from "@/features/automations/types/sse-events";
import { buildFileDownloadUrl } from "@/features/automations/utils/build-file-download-url";
import { useSse } from "@/hooks/use-sse";
import { buildSseUrl } from "@/lib/sse/build-sse-url";
import { parseSseData } from "@/lib/sse/parse-sse-data";
import type { SseConnectionState, SseEventEnvelope } from "@/lib/sse/types";

type UseExecutionFileStreamOptions = {
  executionId: string;
  status: AutomationStatus;
  enabled: boolean;
};

type ExecutionFileStreamState = {
  outputFile: AutomationRuntime["outputFile"];
  connectionState: SseConnectionState;
  isLoadingFile: boolean;
};

function mapUploadFileToOutput(file: {
  id: string;
  executionId: string;
  token: string;
  name: string;
  createdAt: string;
}): AutomationRuntime["outputFile"] {
  return {
    id: file.id,
    name: file.name,
    token: file.token,
    createdAt: file.createdAt,
    url: buildFileDownloadUrl(file.token),
  };
}

export function useExecutionFileStream({
  executionId,
  status,
  enabled,
}: UseExecutionFileStreamOptions): ExecutionFileStreamState {
  const [outputFile, setOutputFile] =
    useState<AutomationRuntime["outputFile"]>(undefined);
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  const sseEnabled =
    enabled &&
    (status === "running" || status === "paused") &&
    outputFile == null;

  const sseUrl = useMemo(
    () => (sseEnabled ? buildSseUrl("/events/stream") : null),
    [sseEnabled],
  );

  const handleSseEvent = useCallback(
    (event: SseEventEnvelope) => {
      if (event.type === "heartbeat") {
        return;
      }

      if (!isUploadFileSseEvent(event)) {
        return;
      }

      const { file } = event.data;
      if (file.executionId !== executionId) {
        return;
      }

      setOutputFile(mapUploadFileToOutput(file));
    },
    [executionId],
  );

  const { connectionState } = useSse<SseEventEnvelope>(sseUrl, {
    enabled: sseEnabled,
    parse: parseSseData,
    onEvent: handleSseEvent,
  });

  useEffect(() => {
    if (status === "idle") {
      setOutputFile(undefined);
      setIsLoadingFile(false);
    }
  }, [status, executionId]);

  useEffect(() => {
    if (status !== "completed" || outputFile != null) {
      return;
    }

    let cancelled = false;
    setIsLoadingFile(true);

    void getExecutionFiles(executionId)
      .then((files) => {
        if (cancelled || files.length === 0) {
          return;
        }

        const latestFile = files[0];
        setOutputFile({
          id: latestFile.token,
          name: latestFile.name,
          token: latestFile.token,
          createdAt: new Date().toISOString(),
          url: buildFileDownloadUrl(latestFile.token),
        });
      })
      .catch(() => {
        // Sem arquivo disponível — UI trata como indisponível
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingFile(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [status, executionId, outputFile]);

  return {
    outputFile,
    connectionState: sseEnabled ? connectionState : "idle",
    isLoadingFile,
  };
}
