export type SseConnectionState =
  | "idle"
  | "connecting"
  | "open"
  | "closed"
  | "error";

export type SseEventEnvelope = {
  type: string;
  channel?: string;
  data?: unknown;
  timestamp: string;
};

export type UseSseOptions<T> = {
  enabled?: boolean;
  withCredentials?: boolean;
  parse?: (raw: MessageEvent) => T | null;
  onEvent?: (event: T) => void;
  onError?: (error: Event) => void;
};
