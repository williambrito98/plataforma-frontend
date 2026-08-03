import type { ParameterInputType } from "@/features/automations/config/input-types";

export type AutomationParameter = {
  id: string;
  name: string;
  type: ParameterInputType;
  label: string;
  placeholder?: string;
  required: boolean;
};

export type AutomationParameterDraft = {
  name: string;
  type: ParameterInputType | "";
  label: string;
  placeholder: string;
  required: boolean;
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
  return parameters.map(({ name, type, label, placeholder, required }) => ({
    name,
    type,
    label,
    required,
    ...(placeholder ? { placeholder } : {}),
  }));
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
