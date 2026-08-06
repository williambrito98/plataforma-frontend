import { z } from "zod";

import { formatTemporalDisplayValue } from "@/features/automations/components/field-pickers/date-format";
import type { AutomationParameter } from "@/features/automations/types/automation";

const TEMPORAL_PATTERNS = {
  date: /^\d{4}-\d{2}-\d{2}$/,
  time: /^\d{2}:\d{2}$/,
  "datetime-local": /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
  month: /^\d{4}-\d{2}$/,
} as const;

function buildOptionalStringSchema() {
  return z.string().trim().optional().or(z.literal(""));
}

function buildRequiredStringSchema(message: string) {
  return z.string().trim().min(1, message);
}

function buildTemporalSchema(
  parameter: AutomationParameter,
  type: keyof typeof TEMPORAL_PATTERNS,
) {
  const pattern = TEMPORAL_PATTERNS[type];
  const requiredMessage = `${parameter.label} é obrigatório`;
  const invalidMessage = `${parameter.label} inválido`;

  if (parameter.required) {
    return z
      .string()
      .trim()
      .min(1, requiredMessage)
      .regex(pattern, invalidMessage);
  }

  return z
    .string()
    .trim()
    .superRefine((value, ctx) => {
      if (value === "") {
        return;
      }

      if (!pattern.test(value)) {
        ctx.addIssue({
          code: "custom",
          message: invalidMessage,
        });
      }
    });
}

function buildNumberSchema(parameter: AutomationParameter) {
  const requiredMessage = `${parameter.label} é obrigatório`;
  const invalidMessage = "Informe um número válido";

  const baseSchema = parameter.required
    ? z.string().trim().min(1, requiredMessage)
    : z.string().trim();

  return baseSchema.superRefine((value, ctx) => {
    if (!parameter.required && value === "") {
      return;
    }

    if (!/^-?\d+(\.\d+)?$/.test(value)) {
      ctx.addIssue({
        code: "custom",
        message: invalidMessage,
      });
      return;
    }

    const numericValue = Number(value);

    if (parameter.min !== undefined && numericValue < parameter.min) {
      ctx.addIssue({
        code: "custom",
        message: `Valor mínimo: ${parameter.min}`,
      });
    }

    if (parameter.max !== undefined && numericValue > parameter.max) {
      ctx.addIssue({
        code: "custom",
        message: `Valor máximo: ${parameter.max}`,
      });
    }
  });
}

function validateFileExtension(
  fileList: FileList,
  extensions?: string[],
): boolean {
  if (!extensions?.length) {
    return true;
  }

  const file = fileList.item(0);
  if (!file) {
    return false;
  }

  const normalizedExtensions = extensions.map((extension) =>
    extension.replace(/^\./, "").toLowerCase(),
  );
  const fileExtension = file.name.split(".").pop()?.toLowerCase();

  return fileExtension ? normalizedExtensions.includes(fileExtension) : false;
}

function buildFieldSchema(parameter: AutomationParameter): z.ZodTypeAny {
  const requiredMessage = `${parameter.label} é obrigatório`;

  switch (parameter.type) {
    case "checkbox":
      return parameter.required
        ? z.literal(true, { message: requiredMessage })
        : z.boolean().optional();

    case "email":
      return parameter.required
        ? z.string().trim().min(1, requiredMessage).email("E-mail inválido")
        : z
            .string()
            .trim()
            .email("E-mail inválido")
            .optional()
            .or(z.literal(""));

    case "number":
      return buildNumberSchema(parameter);

    case "multiselect":
      return parameter.required
        ? z.array(z.string()).min(1, requiredMessage)
        : z.array(z.string()).optional();

    case "radio":
    case "select":
      return parameter.required
        ? buildRequiredStringSchema(requiredMessage)
        : buildOptionalStringSchema();

    case "tel":
    case "url":
    case "search":
    case "text":
    case "password":
      return parameter.required
        ? buildRequiredStringSchema(requiredMessage)
        : buildOptionalStringSchema();

    case "date":
    case "time":
    case "datetime-local":
    case "month":
      return buildTemporalSchema(parameter, parameter.type);

    case "date-range":
      return z.object({}).passthrough();

    case "file":
      if (parameter.required) {
        return z
          .custom<FileList>(
            (val) => val instanceof FileList && val.length > 0,
            { message: requiredMessage },
          )
          .refine(
            (fileList) => validateFileExtension(fileList, parameter.extensions),
            "Extensão de arquivo não permitida",
          );
      }

      return z
        .custom<FileList | undefined>(
          (val) =>
            val === undefined ||
            val === null ||
            (val instanceof FileList && val.length >= 0),
        )
        .optional()
        .refine(
          (fileList) =>
            !fileList ||
            fileList.length === 0 ||
            validateFileExtension(fileList, parameter.extensions),
          "Extensão de arquivo não permitida",
        );

    default:
      return parameter.required
        ? buildRequiredStringSchema(requiredMessage)
        : buildOptionalStringSchema();
  }
}

export function buildParametersSchema(parameters: AutomationParameter[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const parameter of parameters) {
    if (parameter.type === "date-range") {
      const startField = `${parameter.name}_start`;
      const endField = `${parameter.name}_end`;

      shape[startField] = buildTemporalSchema(parameter, "date");
      shape[endField] = buildTemporalSchema(parameter, "date");
      continue;
    }

    shape[parameter.name] = buildFieldSchema(parameter);
  }

  return z.object(shape).superRefine((values, ctx) => {
    for (const parameter of parameters) {
      if (parameter.type !== "date-range") {
        continue;
      }

      const start = String(values[`${parameter.name}_start`] ?? "");
      const end = String(values[`${parameter.name}_end`] ?? "");

      if (start && end && start > end) {
        ctx.addIssue({
          code: "custom",
          message: "A data inicial deve ser anterior ou igual à data final",
          path: [`${parameter.name}_end`],
        });
      }
    }
  });
}

function formatMultiselectValue(
  parameter: AutomationParameter,
  values: string[],
): string {
  const labels = (parameter.options ?? [])
    .filter((option) => values.includes(option.value))
    .map((option) => option.label);

  return labels.length > 0 ? labels.join(", ") : values.join(", ");
}

export function normalizeParameterValues(
  parameters: AutomationParameter[],
  values: Record<string, unknown>,
): Record<string, string> {
  const normalized: Record<string, string> = {};

  for (const parameter of parameters) {
    if (parameter.type === "date-range") {
      const start = String(values[`${parameter.name}_start`] ?? "");
      const end = String(values[`${parameter.name}_end`] ?? "");
      const startLabel = formatTemporalDisplayValue(
        "date",
        start,
        parameter.format,
      );
      const endLabel = formatTemporalDisplayValue(
        "date",
        end,
        parameter.format,
      );

      if (startLabel || endLabel) {
        normalized[parameter.label] =
          startLabel && endLabel
            ? `${startLabel} — ${endLabel}`
            : startLabel || endLabel;
      }
      continue;
    }

    const value = values[parameter.name];

    if (parameter.type === "checkbox") {
      if (value === true) {
        normalized[parameter.label] = "Sim";
      } else if (value === false) {
        normalized[parameter.label] = "Não";
      }
      continue;
    }

    if (parameter.type === "multiselect" && Array.isArray(value)) {
      const selectedValues = value.filter(
        (item): item is string => typeof item === "string",
      );

      if (selectedValues.length > 0) {
        normalized[parameter.label] = formatMultiselectValue(
          parameter,
          selectedValues,
        );
      }
      continue;
    }

    if (
      parameter.type === "date" ||
      parameter.type === "time" ||
      parameter.type === "datetime-local" ||
      parameter.type === "month"
    ) {
      const stringValue = String(value ?? "");
      const formatted = formatTemporalDisplayValue(
        parameter.type,
        stringValue,
        parameter.format,
      );

      if (formatted) {
        normalized[parameter.label] = formatted;
      }
      continue;
    }

    if (parameter.type === "radio" || parameter.type === "select") {
      const selected = String(value ?? "");
      const option = parameter.options?.find((item) => item.value === selected);
      if (option) {
        normalized[parameter.label] = option.label;
      } else if (selected.trim() !== "") {
        normalized[parameter.label] = selected;
      }
      continue;
    }

    if (value instanceof FileList && value.length > 0) {
      normalized[parameter.label] = value[0]?.name ?? "";
      continue;
    }

    if (value instanceof File) {
      normalized[parameter.label] = value.name;
      continue;
    }

    if (value !== undefined && value !== null && String(value).trim() !== "") {
      normalized[parameter.label] = String(value);
    }
  }

  return normalized;
}

export function buildParameterDefaultValues(parameters: AutomationParameter[]) {
  const defaults: Record<string, unknown> = {};

  for (const parameter of parameters) {
    if (parameter.type === "date-range") {
      defaults[`${parameter.name}_start`] = "";
      defaults[`${parameter.name}_end`] = "";
      continue;
    }

    if (parameter.type === "checkbox") {
      defaults[parameter.name] = false;
      continue;
    }

    if (parameter.type === "multiselect") {
      defaults[parameter.name] = [];
      continue;
    }

    if (parameter.type === "file") {
      defaults[parameter.name] = undefined;
      continue;
    }

    defaults[parameter.name] = "";
  }

  return defaults;
}
