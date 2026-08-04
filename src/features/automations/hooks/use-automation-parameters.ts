import { useCallback, useState } from "react";

import type {
  AutomationParameter,
  AutomationParameterDraft,
} from "@/features/automations/types/automation";

const emptyDraft: AutomationParameterDraft = {
  name: "",
  type: "",
  label: "",
  placeholder: "",
  required: false,
  options: "",
};

export function useAutomationParameters() {
  const [parameters, setParameters] = useState<AutomationParameter[]>([]);
  const [draft, setDraft] = useState<AutomationParameterDraft>(emptyDraft);

  const addParameter = useCallback(
    (parameterDraft: AutomationParameterDraft) => {
      if (
        !parameterDraft.name.trim() ||
        !parameterDraft.type ||
        !parameterDraft.label.trim()
      ) {
        return { success: false as const, error: "missing-fields" as const };
      }

      const parameter: AutomationParameter = {
        id: crypto.randomUUID(),
        name: parameterDraft.name.trim(),
        type: parameterDraft.type,
        label: parameterDraft.label.trim(),
        placeholder: parameterDraft.placeholder.trim() || undefined,
        required: parameterDraft.required,
        ...(parameterDraft.type === "select"
          ? {
              options: parameterDraft.options
                .split(",")
                .map((option) => option.trim())
                .filter(Boolean)
                .map((value) => ({ value, label: value })),
            }
          : {}),
      };

      setParameters((current) => [...current, parameter]);
      setDraft(emptyDraft);

      return { success: true as const };
    },
    [],
  );

  const removeParameter = useCallback((id: string) => {
    setParameters((current) =>
      current.filter((parameter) => parameter.id !== id),
    );
  }, []);

  const clearParameters = useCallback(() => {
    setParameters([]);
    setDraft(emptyDraft);
  }, []);

  const updateDraft = useCallback(
    (updates: Partial<AutomationParameterDraft>) => {
      setDraft((current) => ({ ...current, ...updates }));
    },
    [],
  );

  return {
    parameters,
    draft,
    addParameter,
    removeParameter,
    clearParameters,
    updateDraft,
  };
}
