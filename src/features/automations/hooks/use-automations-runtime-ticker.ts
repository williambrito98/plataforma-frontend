import { useEffect } from "react";

import { useAutomationsRuntimeStore } from "@/features/automations/stores/automations-runtime-store";

export function useAutomationsRuntimeTicker() {
  const tick = useAutomationsRuntimeStore((state) => state.tick);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      tick();
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [tick]);
}
