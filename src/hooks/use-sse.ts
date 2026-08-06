import { useEffect, useRef, useState } from "react";

import type { SseConnectionState, UseSseOptions } from "@/lib/sse/types";

export function useSse<T>(
  url: string | null,
  {
    enabled = true,
    withCredentials = true,
    parse,
    onEvent,
    onError,
  }: UseSseOptions<T> = {},
): { connectionState: SseConnectionState } {
  const [connectionState, setConnectionState] =
    useState<SseConnectionState>("idle");

  const onEventRef = useRef(onEvent);
  const onErrorRef = useRef(onError);
  const parseRef = useRef(parse);

  onEventRef.current = onEvent;
  onErrorRef.current = onError;
  parseRef.current = parse;

  useEffect(() => {
    if (!enabled || !url) {
      setConnectionState("idle");
      return;
    }

    setConnectionState("connecting");

    const eventSource = new EventSource(url, { withCredentials });

    eventSource.onopen = () => {
      setConnectionState("open");
    };

    eventSource.onmessage = (event) => {
      const parsed = parseRef.current
        ? parseRef.current(event)
        : (event as unknown as T);

      if (parsed != null) {
        onEventRef.current?.(parsed);
      }
    };

    eventSource.onerror = (error) => {
      setConnectionState("error");
      onErrorRef.current?.(error);
    };

    return () => {
      eventSource.close();
      setConnectionState("closed");
    };
  }, [enabled, url, withCredentials]);

  return { connectionState };
}
