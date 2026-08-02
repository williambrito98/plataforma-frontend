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
};

export type CreateAutomationPayload = CreateAutomationFormValues & {
  fields: AutomationParameter[];
};
