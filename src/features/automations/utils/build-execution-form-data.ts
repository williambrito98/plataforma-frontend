import { formatTemporalDisplayValue } from "@/features/automations/components/field-pickers/date-format";
import type { AutomationParameter } from "@/features/automations/types/automation";

function appendField(
  formData: FormData,
  name: string,
  value: string | Blob,
): void {
  formData.append(`fields[${name}]`, value);
}

function formatDateRangeValue(
  parameter: AutomationParameter,
  values: Record<string, unknown>,
): string {
  const start = String(values[`${parameter.name}_start`] ?? "");
  const end = String(values[`${parameter.name}_end`] ?? "");
  const startLabel = formatTemporalDisplayValue(
    "date",
    start,
    parameter.format,
  );
  const endLabel = formatTemporalDisplayValue("date", end, parameter.format);

  if (startLabel && endLabel) {
    return `${startLabel} — ${endLabel}`;
  }

  return startLabel || endLabel;
}

function getFileFromValue(value: unknown): File | undefined {
  if (value instanceof FileList && value.length > 0) {
    return value[0] ?? undefined;
  }

  if (value instanceof File) {
    return value;
  }

  return undefined;
}

export function buildExecutionFormData(
  parameters: AutomationParameter[],
  values: Record<string, unknown>,
): FormData {
  const formData = new FormData();

  for (const parameter of parameters) {
    if (parameter.type === "date-range") {
      const formatted = formatDateRangeValue(parameter, values);
      if (formatted) {
        appendField(formData, parameter.name, formatted);
      }
      continue;
    }

    const value = values[parameter.name];

    if (parameter.type === "checkbox") {
      if (value === true) {
        appendField(formData, parameter.name, "true");
      }
      continue;
    }

    if (parameter.type === "multiselect" && Array.isArray(value)) {
      const selectedValues = value.filter(
        (item): item is string =>
          typeof item === "string" && item.trim() !== "",
      );

      if (selectedValues.length > 0) {
        appendField(formData, parameter.name, selectedValues.join(","));
      }
      continue;
    }

    if (
      parameter.type === "date" ||
      parameter.type === "time" ||
      parameter.type === "datetime-local" ||
      parameter.type === "month"
    ) {
      const formatted = formatTemporalDisplayValue(
        parameter.type,
        String(value ?? ""),
        parameter.format,
      );

      if (formatted) {
        appendField(formData, parameter.name, formatted);
      }
      continue;
    }

    if (parameter.type === "file") {
      const file = getFileFromValue(value);
      if (file) {
        appendField(formData, parameter.name, file);
      }
      continue;
    }

    if (value !== undefined && value !== null && String(value).trim() !== "") {
      appendField(formData, parameter.name, String(value).trim());
    }
  }

  return formData;
}

export function formDataToDebugObject(
  formData: FormData,
): Record<string, string> {
  const debug: Record<string, string> = {};

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      debug[key] = `[File] ${value.name}`;
      continue;
    }

    debug[key] = value;
  }

  return debug;
}
