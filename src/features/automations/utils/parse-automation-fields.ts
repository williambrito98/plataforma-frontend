import { PARAMETER_INPUT_TYPES } from "@/features/automations/config/input-types";
import type {
  AutomationParameter,
  AutomationParameterOption,
} from "@/features/automations/types/automation";

type ParameterInputType = (typeof PARAMETER_INPUT_TYPES)[number]["value"];

const VALID_TYPES = new Set<string>(PARAMETER_INPUT_TYPES.map((t) => t.value));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseOptions(raw: unknown): AutomationParameterOption[] | undefined {
  if (!Array.isArray(raw)) {
    return undefined;
  }

  const options = raw
    .filter(isRecord)
    .map((item) => {
      const value = item.value;
      const label = item.label;

      if (typeof value !== "string" || typeof label !== "string") {
        return null;
      }

      return { value, label };
    })
    .filter((item): item is AutomationParameterOption => item !== null);

  return options.length > 0 ? options : undefined;
}

function parseField(raw: unknown, index: number): AutomationParameter | null {
  if (!isRecord(raw)) {
    return null;
  }

  const name = raw.name;
  const type = raw.type;
  const label = raw.label;
  const required = raw.required;

  if (
    typeof name !== "string" ||
    typeof label !== "string" ||
    typeof type !== "string" ||
    !VALID_TYPES.has(type)
  ) {
    return null;
  }

  const placeholder =
    typeof raw.placeholder === "string" ? raw.placeholder : undefined;

  return {
    id: name || `field-${index}`,
    name,
    type: type as ParameterInputType,
    label,
    required: required === true,
    ...(placeholder ? { placeholder } : {}),
    ...(parseOptions(raw.options)
      ? { options: parseOptions(raw.options) }
      : {}),
  };
}

export function parseAutomationFields(fields: unknown): AutomationParameter[] {
  if (!Array.isArray(fields)) {
    return [];
  }

  return fields
    .map((field, index) => parseField(field, index))
    .filter((field): field is AutomationParameter => field !== null);
}
