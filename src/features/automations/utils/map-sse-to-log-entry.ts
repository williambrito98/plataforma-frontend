import type { ConsolePayload } from "@/features/automations/types/sse-events";
import type { AutomationLogEntry } from "@/features/automations/types/automation";
import { formatLogTimeFromIso } from "@/features/automations/utils/format-log-time";

export function mapSseToLogEntry(
  payload: ConsolePayload,
  timestamp: string,
): AutomationLogEntry {
  return {
    id: crypto.randomUUID(),
    time: formatLogTimeFromIso(timestamp),
    message: payload.message,
    variant: "info",
  };
}

export function appendLogEntry(
  logs: AutomationLogEntry[],
  entry: AutomationLogEntry,
): AutomationLogEntry[] {
  const lastLog = logs.at(-1);
  if (lastLog?.message === entry.message) {
    return logs;
  }

  return [...logs, entry];
}

export function extractProgressFromPayload(payload: ConsolePayload): {
  processed?: number;
  total?: number;
} {
  if (!payload.progress) {
    return {};
  }

  const { processed, total } = payload.progress;

  return {
    ...(processed != null ? { processed } : {}),
    ...(total != null ? { total } : {}),
  };
}
