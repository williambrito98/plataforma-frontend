import { useCallback, useState } from "react";

import {
  getDefaultTemporalFormat,
  isValidTemporalFormat,
} from "@/features/automations/components/field-pickers/date-format";
import type {
  AutomationParameter,
  AutomationParameterDraft,
  AutomationParameterOption,
} from "@/features/automations/types/automation";

const emptyDraft: AutomationParameterDraft = {
  name: "",
  type: "",
  label: "",
  placeholder: "",
  format: "",
  required: false,
  options: [],
  extensionsText: "",
  templateFileUpload: undefined,
};

function parseOptionsFromDraft(
  options: AutomationParameterDraft["options"],
): AutomationParameterOption[] {
  return options
    .map((option) => ({
      label: option.label.trim(),
      value: option.value.trim(),
    }))
    .filter((option) => option.label && option.value);
}

function parseExtensionsFromDraft(text: string): string[] {
  const seen = new Set<string>();

  return text
    .split(",")
    .map((extension) => extension.trim().replace(/^\./, "").toLowerCase())
    .filter((extension) => {
      if (!extension || seen.has(extension)) {
        return false;
      }

      seen.add(extension);
      return true;
    });
}

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

      const needsOptions =
        parameterDraft.type === "select" ||
        parameterDraft.type === "multiselect";
      const options = needsOptions
        ? parseOptionsFromDraft(parameterDraft.options)
        : undefined;

      if (needsOptions && (!options || options.length === 0)) {
        return { success: false as const, error: "missing-options" as const };
      }

      if (
        parameterDraft.type === "file" &&
        !parameterDraft.templateFileUpload
      ) {
        return {
          success: false as const,
          error: "missing-template-file" as const,
        };
      }

      if (parameterDraft.type === "date" || parameterDraft.type === "month") {
        const formatValue =
          parameterDraft.format.trim() ||
          getDefaultTemporalFormat(parameterDraft.type);

        if (!isValidTemporalFormat(parameterDraft.type, formatValue)) {
          return {
            success: false as const,
            error: "invalid-format" as const,
          };
        }
      }

      const extensions =
        parameterDraft.type === "file"
          ? parseExtensionsFromDraft(parameterDraft.extensionsText)
          : [];

      const parameter: AutomationParameter = {
        id: crypto.randomUUID(),
        name: parameterDraft.name.trim(),
        type: parameterDraft.type,
        label: parameterDraft.label.trim(),
        placeholder: parameterDraft.placeholder.trim() || undefined,
        required: parameterDraft.required,
        ...(options?.length ? { options } : {}),
        ...(extensions.length ? { extensions } : {}),
        ...(parameterDraft.type === "file" && parameterDraft.templateFileUpload
          ? { templateFileUpload: parameterDraft.templateFileUpload }
          : {}),
        ...(parameterDraft.type === "date" || parameterDraft.type === "month"
          ? {
              format:
                parameterDraft.format.trim() ||
                getDefaultTemporalFormat(parameterDraft.type),
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

  const setParametersFromList = useCallback(
    (nextParameters: AutomationParameter[]) => {
      setParameters(nextParameters);
      setDraft(emptyDraft);
    },
    [],
  );

  return {
    parameters,
    draft,
    addParameter,
    removeParameter,
    clearParameters,
    setParameters: setParametersFromList,
    updateDraft,
  };
}
