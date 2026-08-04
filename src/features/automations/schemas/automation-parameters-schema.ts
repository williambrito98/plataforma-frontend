import { z } from "zod";

import type { AutomationParameter } from "@/features/automations/types/automation";

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
      return parameter.required
        ? z
            .string()
            .trim()
            .min(1, requiredMessage)
            .regex(/^\d+$/, "Informe um número válido")
        : z
            .string()
            .trim()
            .regex(/^\d*$/, "Informe um número válido")
            .optional();

    case "date-range":
      return z.object({}).passthrough();

    case "file":
      return parameter.required
        ? z.custom<FileList>(
            (val) => val instanceof FileList && val.length > 0,
            { message: requiredMessage },
          )
        : z
            .custom<
              FileList | undefined
            >((val) => val === undefined || val === null || (val instanceof FileList && val.length >= 0))
            .optional();

    default:
      return parameter.required
        ? z.string().trim().min(1, requiredMessage)
        : z.string().trim().optional();
  }
}

export function buildParametersSchema(parameters: AutomationParameter[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const parameter of parameters) {
    if (parameter.type === "date-range") {
      const startField = `${parameter.name}_start`;
      const endField = `${parameter.name}_end`;

      shape[startField] = parameter.required
        ? z.string().min(1, "Data inicial é obrigatória")
        : z.string().optional();
      shape[endField] = parameter.required
        ? z.string().min(1, "Data final é obrigatória")
        : z.string().optional();
      continue;
    }

    shape[parameter.name] = buildFieldSchema(parameter);
  }

  return z.object(shape);
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

      if (start || end) {
        normalized[parameter.label] =
          start && end ? `${start} — ${end}` : start || end;
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

    if (parameter.type === "file") {
      defaults[parameter.name] = undefined;
      continue;
    }

    defaults[parameter.name] = "";
  }

  return defaults;
}
