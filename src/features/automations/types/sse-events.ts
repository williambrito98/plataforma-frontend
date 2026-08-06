import type { ExecutionStatusApi } from "@/features/automations/types/automation";
import type { SseEventEnvelope } from "@/lib/sse/types";

export type ConsoleProgress = {
  percentage?: number;
  processed?: number;
  total?: number;
};

export type ConsolePayload = {
  executionId: string;
  message: string;
  progress?: ConsoleProgress;
};

export type ExecutionStatusPayload = {
  executionId: string;
  status: ExecutionStatusApi;
  updatedAt: string;
};

export type UploadFileData = {
  id: string;
  executionId: string;
  token: string;
  name: string;
  createdAt: string;
};

export type UploadFilePayload = {
  file: UploadFileData;
};

export type SseEventType =
  | "console_update"
  | "execute_console"
  | "upload_file"
  | "execution_status"
  | "heartbeat";

export type AutomationSseEvent = SseEventEnvelope & {
  type: SseEventType;
};

export function isConsoleSseEvent(
  event: SseEventEnvelope,
): event is AutomationSseEvent & { data: ConsolePayload } {
  return (
    (event.type === "execute_console" || event.type === "console_update") &&
    event.data != null &&
    typeof event.data === "object" &&
    "message" in event.data &&
    typeof (event.data as ConsolePayload).message === "string"
  );
}

export function isExecutionStatusSseEvent(
  event: SseEventEnvelope,
): event is AutomationSseEvent & { data: ExecutionStatusPayload } {
  return (
    event.type === "execution_status" &&
    event.data != null &&
    typeof event.data === "object" &&
    "status" in event.data
  );
}

export function isUploadFileSseEvent(
  event: SseEventEnvelope,
): event is AutomationSseEvent & { data: UploadFilePayload } {
  if (event.type !== "upload_file") {
    return false;
  }

  const data = event.data;
  if (data == null || typeof data !== "object" || !("file" in data)) {
    return false;
  }

  const file = (data as UploadFilePayload).file;
  return (
    typeof file === "object" &&
    file != null &&
    typeof file.executionId === "string" &&
    typeof file.token === "string" &&
    typeof file.name === "string"
  );
}
