import type { SseEventEnvelope } from "@/lib/sse/types";

export function parseSseData(raw: MessageEvent): SseEventEnvelope | null {
  if (typeof raw.data !== "string" || !raw.data.trim()) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw.data) as unknown;

    if (
      !parsed ||
      typeof parsed !== "object" ||
      !("type" in parsed) ||
      typeof (parsed as SseEventEnvelope).type !== "string"
    ) {
      return null;
    }

    return parsed as SseEventEnvelope;
  } catch {
    return null;
  }
}
