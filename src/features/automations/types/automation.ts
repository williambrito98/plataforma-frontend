import type { ParameterInputType } from "@/features/automations/config/input-types";

export type AutomationCategorySlug =
  | "fiscal"
  | "pessoal"
  | "contabil"
  | "trabalhista";

export type AutomationStatus = "idle" | "running" | "paused" | "maintenance";

export type AutomationLogEntry = {
  id: string;
  time: string;
  message: string;
  variant: "info" | "error";
};

export type AutomationRuntime = {
  status: AutomationStatus;
  processed: number;
  total: number;
  startedAt: string | null;
  finishedAt: string | null;
  elapsedSeconds: number;
  logs: AutomationLogEntry[];
  submittedValues: Record<string, string>;
  errorMessage?: string;
};

export type AutomationParameterOption = {
  value: string;
  label: string;
};

export type AutomationParameter = {
  id: string;
  name: string;
  type: ParameterInputType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: AutomationParameterOption[];
};

export type AutomationParameterDraft = {
  name: string;
  type: ParameterInputType | "";
  label: string;
  placeholder: string;
  required: boolean;
  options: string;
};

export type AutomationListItem = {
  id: string;
  name: string;
  category: AutomationCategorySlug;
  categoryLabel: string;
  fields: AutomationParameter[];
  defaultTotal?: number;
};

export type CreateAutomationFormValues = {
  name: string;
  description: string;
  path: string;
  categoryId: string;
};

export type CreateAutomationPayload = CreateAutomationFormValues & {
  fields: AutomationParameter[];
};

export type AutomationFieldApiPayload = {
  name: string;
  type: ParameterInputType;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: AutomationParameterOption[];
};

export type CreateAutomationRequest = CreateAutomationFormValues & {
  fields: AutomationFieldApiPayload[];
};

export type AutomationCategoryApiResponse = {
  id: string;
  name: string;
};

export type AutomationApiResponse = {
  id: string;
  name: string;
  description: string | null;
  fields: unknown;
  path: string;
  createdAt: string;
  updatedAt: string;
  category: AutomationCategoryApiResponse;
};

export type Automation = {
  id: string;
  name: string;
  description: string | null;
  fields: unknown;
  path: string;
  createdAt: string;
  updatedAt: string;
  category: AutomationCategoryApiResponse;
};

export function serializeAutomationFields(
  parameters: AutomationParameter[],
): AutomationFieldApiPayload[] {
  return parameters.map(
    ({ name, type, label, placeholder, required, options }) => ({
      name,
      type,
      label,
      required,
      ...(placeholder ? { placeholder } : {}),
      ...(options?.length ? { options } : {}),
    }),
  );
}

export function createEmptyRuntime(): AutomationRuntime {
  return {
    status: "idle",
    processed: 0,
    total: 0,
    startedAt: null,
    finishedAt: null,
    elapsedSeconds: 0,
    logs: [],
    submittedValues: {},
  };
}

export function normalizeAutomation(
  automation: AutomationApiResponse,
): Automation {
  return {
    id: automation.id,
    name: automation.name,
    description: automation.description,
    fields: automation.fields,
    path: automation.path,
    createdAt: automation.createdAt,
    updatedAt: automation.updatedAt,
    category: automation.category,
  };
}
