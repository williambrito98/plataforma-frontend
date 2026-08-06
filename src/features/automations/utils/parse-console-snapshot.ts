import type { ConsoleProgress } from "@/features/automations/types/sse-events";
import type { AutomationLogEntry } from "@/features/automations/types/automation";
import { formatLogTimeFromIso } from "@/features/automations/utils/format-log-time";

export type ConsoleSnapshot = {
  message: string[];
  progress?: {
    percentage: number;
    processed: number;
    total: number;
  };
};

function buildConsoleProgress(
  progress: ConsoleProgress,
): ConsoleSnapshot["progress"] | undefined {
  const { processed, total } = progress;

  if (processed == null || total == null) {
    return undefined;
  }

  const percentage =
    progress.percentage != null
      ? progress.percentage
      : (processed / total) * 100;

  return { percentage, processed, total };
}

function normalizeConsoleLogSnapshot(
  parsed: Record<string, unknown>,
): ConsoleSnapshot {
  const snapshot: ConsoleSnapshot = { message: [] };

  if (Array.isArray(parsed.message)) {
    snapshot.message = parsed.message.filter(
      (entry): entry is string => typeof entry === "string",
    );
  } else if (typeof parsed.message === "string") {
    snapshot.message = [parsed.message];
  }

  if (parsed.progress && typeof parsed.progress === "object") {
    const progress = buildConsoleProgress(parsed.progress as ConsoleProgress);
    if (progress) {
      snapshot.progress = progress;
    }
  }

  return snapshot;
}

export function createEmptyConsoleSnapshot(): ConsoleSnapshot {
  return { message: [] };
}

export function parseConsoleSnapshot(
  raw: string | Record<string, unknown> | null | undefined,
): ConsoleSnapshot {
  if (raw == null) {
    return createEmptyConsoleSnapshot();
  }

  if (typeof raw === "object") {
    return normalizeConsoleLogSnapshot(raw);
  }

  if (!raw.trim()) {
    return createEmptyConsoleSnapshot();
  }

  const trimmed = raw.trim();

  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed) as Record<string, unknown>;
      return normalizeConsoleLogSnapshot(parsed);
    } catch {
      return createEmptyConsoleSnapshot();
    }
  }

  const snapshot = createEmptyConsoleSnapshot();

  for (const line of raw.split("\n")) {
    const entry = line.trim();
    if (!entry.startsWith("{")) {
      continue;
    }

    try {
      const parsed = JSON.parse(entry) as Record<string, unknown>;
      const normalized = normalizeConsoleLogSnapshot(parsed);
      snapshot.message.push(...normalized.message);
      if (normalized.progress) {
        snapshot.progress = normalized.progress;
      }
    } catch {
      continue;
    }
  }

  return snapshot;
}

export function consoleSnapshotToLogEntries(
  snapshot: ConsoleSnapshot,
  baseTimestamp?: string,
): AutomationLogEntry[] {
  const time = baseTimestamp
    ? formatLogTimeFromIso(baseTimestamp)
    : formatLogTimeFromIso(new Date().toISOString());

  return snapshot.message.map((message, index) => ({
    id: `snapshot-${index}-${message.slice(0, 20)}`,
    time,
    message,
    variant: "info" as const,
  }));
}

export function consoleSnapshotToProgress(snapshot: ConsoleSnapshot): {
  processed: number;
  total: number;
} {
  return {
    processed: snapshot.progress?.processed ?? 0,
    total: snapshot.progress?.total ?? 0,
  };
}
