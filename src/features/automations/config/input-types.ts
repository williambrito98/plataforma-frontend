export const PARAMETER_INPUT_TYPES = [
  { value: "text", label: "Texto" },
  { value: "number", label: "Número" },
  { value: "email", label: "E-mail" },
  { value: "password", label: "Senha" },
  { value: "date", label: "Data" },
  { value: "date-range", label: "Período" },
  { value: "file", label: "Arquivo" },
  { value: "select", label: "Seleção" },
  { value: "checkbox", label: "Checkbox" },
  { value: "textarea", label: "Área de texto" },
] as const;

export type ParameterInputType =
  (typeof PARAMETER_INPUT_TYPES)[number]["value"];

export function getParameterInputTypeLabel(type: ParameterInputType): string {
  return (
    PARAMETER_INPUT_TYPES.find((option) => option.value === type)?.label ?? type
  );
}
