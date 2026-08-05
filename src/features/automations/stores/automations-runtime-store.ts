import { create } from "zustand";

import {
  AUTOMATION_LOG_SCRIPT,
  formatLogTime,
  MOCK_AUTOMATIONS,
  MOCK_INITIAL_RUNTIMES,
} from "@/features/automations/mocks/automations";
import type { AutomationRuntime } from "@/features/automations/types/automation";
import { createEmptyRuntime } from "@/features/automations/types/automation";

type AutomationsRuntimeState = {
  runtimes: Record<string, AutomationRuntime>;
  start: (
    automationId: string,
    submittedValues: Record<string, string>,
    total?: number,
  ) => void;
  restart: (automationId: string) => void;
  pause: (automationId: string) => void;
  resume: (automationId: string) => void;
  cancel: (automationId: string) => void;
  fail: (automationId: string, errorMessage: string) => void;
  tick: () => void;
};

function getAutomationTotal(automationId: string, total?: number): number {
  if (total !== undefined) {
    return total;
  }

  const automation = MOCK_AUTOMATIONS.find((item) => item.id === automationId);
  return automation?.defaultTotal ?? 100;
}

function getMockOutputFile(automationId: string): { name: string } {
  const slug = automationId.replace(/^auto-/, "");
  return { name: `${slug}.zip` };
}

function appendLogForProgress(
  runtime: AutomationRuntime,
  processed: number,
): AutomationRuntime["logs"] {
  if (runtime.total <= 0) {
    return runtime.logs;
  }

  const progressRatio = processed / runtime.total;
  const scriptIndex = Math.min(
    Math.floor(progressRatio * AUTOMATION_LOG_SCRIPT.length),
    AUTOMATION_LOG_SCRIPT.length - 1,
  );
  const scriptEntry = AUTOMATION_LOG_SCRIPT[scriptIndex];

  if (
    !scriptEntry ||
    runtime.logs.some((log) => log.message === scriptEntry.message)
  ) {
    return runtime.logs;
  }

  return [
    ...runtime.logs,
    {
      id: crypto.randomUUID(),
      time: formatLogTime(new Date()),
      message: scriptEntry.message,
      variant: scriptEntry.variant,
    },
  ];
}

export const useAutomationsRuntimeStore = create<AutomationsRuntimeState>(
  (set) => ({
    runtimes: MOCK_INITIAL_RUNTIMES,

    start: (automationId, submittedValues, total) => {
      const executionTotal = getAutomationTotal(automationId, total);
      const firstLog = AUTOMATION_LOG_SCRIPT[0];

      set((state) => ({
        runtimes: {
          ...state.runtimes,
          [automationId]: {
            status: "running",
            processed: 0,
            total: executionTotal,
            startedAt: new Date().toISOString(),
            finishedAt: null,
            elapsedSeconds: 0,
            logs: firstLog
              ? [
                  {
                    id: crypto.randomUUID(),
                    time: formatLogTime(new Date()),
                    message: firstLog.message,
                    variant: firstLog.variant,
                  },
                ]
              : [],
            submittedValues,
          },
        },
      }));
    },

    restart: (automationId) => {
      set((state) => ({
        runtimes: {
          ...state.runtimes,
          [automationId]: createEmptyRuntime(),
        },
      }));
    },

    pause: (automationId) => {
      set((state) => {
        const runtime = state.runtimes[automationId];
        if (!runtime || runtime.status !== "running") {
          return state;
        }

        return {
          runtimes: {
            ...state.runtimes,
            [automationId]: { ...runtime, status: "paused" },
          },
        };
      });
    },

    resume: (automationId) => {
      set((state) => {
        const runtime = state.runtimes[automationId];
        if (!runtime || runtime.status !== "paused") {
          return state;
        }

        return {
          runtimes: {
            ...state.runtimes,
            [automationId]: { ...runtime, status: "running" },
          },
        };
      });
    },

    cancel: (automationId) => {
      set((state) => ({
        runtimes: {
          ...state.runtimes,
          [automationId]: createEmptyRuntime(),
        },
      }));
    },

    fail: (automationId, errorMessage) => {
      set((state) => {
        const runtime = state.runtimes[automationId];
        if (!runtime || runtime.status !== "running") {
          return state;
        }

        return {
          runtimes: {
            ...state.runtimes,
            [automationId]: {
              ...runtime,
              status: "maintenance",
              errorMessage,
              logs: [
                ...runtime.logs,
                {
                  id: crypto.randomUUID(),
                  time: formatLogTime(new Date()),
                  message: errorMessage,
                  variant: "error" as const,
                },
              ],
            },
          },
        };
      });
    },

    tick: () => {
      set((state) => {
        const nextRuntimes = { ...state.runtimes };
        let changed = false;

        for (const [automationId, runtime] of Object.entries(nextRuntimes)) {
          if (runtime.status !== "running") {
            continue;
          }

          changed = true;
          const elapsedSeconds = runtime.elapsedSeconds + 1;
          let processed = runtime.processed;
          let logs = runtime.logs;

          if (elapsedSeconds % 2 === 0 && processed < runtime.total) {
            processed += 1;
            logs = appendLogForProgress({ ...runtime, processed }, processed);
          }

          if (processed >= runtime.total) {
            const finalLogs = appendLogForProgress(
              { ...runtime, processed, logs },
              processed,
            );

            nextRuntimes[automationId] = {
              ...runtime,
              status: "completed",
              processed,
              elapsedSeconds,
              logs: finalLogs,
              finishedAt: new Date().toISOString(),
              outputFile: getMockOutputFile(automationId),
            };
          } else {
            nextRuntimes[automationId] = {
              ...runtime,
              processed,
              elapsedSeconds,
              logs,
            };
          }
        }

        return changed ? { runtimes: nextRuntimes } : state;
      });
    },
  }),
);

export function useAutomationRuntime(automationId: string) {
  return useAutomationsRuntimeStore(
    (state) => state.runtimes[automationId] ?? createEmptyRuntime(),
  );
}
