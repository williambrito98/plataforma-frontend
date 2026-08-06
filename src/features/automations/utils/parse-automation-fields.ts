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

function parseNumber(raw: unknown): number | undefined {
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return raw;
  }

  if (typeof raw === "string" && raw.trim() !== "") {
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function parseStringArray(raw: unknown): string[] | undefined {
  if (!Array.isArray(raw)) {
    return undefined;
  }

  const values = raw.filter((item): item is string => typeof item === "string");
  return values.length > 0 ? values : undefined;
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
  const format = typeof raw.format === "string" ? raw.format : undefined;
  const min = parseNumber(raw.min);
  const max = parseNumber(raw.max);
  const step = parseNumber(raw.step);
  const rows = parseNumber(raw.rows);
  const multiple = raw.multiple === true ? true : undefined;
  const extensions = parseStringArray(raw.extensions);
  const options = parseOptions(raw.options);

  return {
    id: name || `field-${index}`,
    name,
    type: type as ParameterInputType,
    label,
    required: required === true,
    ...(placeholder ? { placeholder } : {}),
    ...(format ? { format } : {}),
    ...(min !== undefined ? { min } : {}),
    ...(max !== undefined ? { max } : {}),
    ...(step !== undefined ? { step } : {}),
    ...(rows !== undefined ? { rows } : {}),
    ...(multiple ? { multiple } : {}),
    ...(extensions ? { extensions } : {}),
    ...(options ? { options } : {}),
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
