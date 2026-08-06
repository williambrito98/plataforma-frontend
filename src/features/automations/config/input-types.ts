export const PARAMETER_INPUT_TYPES = [
  { value: "text", label: "Texto" },
  { value: "email", label: "E-mail" },
  { value: "password", label: "Senha" },
  { value: "tel", label: "Telefone" },
  { value: "url", label: "URL" },
  { value: "search", label: "Pesquisa" },
  { value: "number", label: "Número" },
  { value: "date", label: "Data" },
  { value: "time", label: "Horário" },
  { value: "datetime-local", label: "Data e hora" },
  { value: "month", label: "Mês" },
  { value: "date-range", label: "Período" },
  { value: "textarea", label: "Área de texto" },
  { value: "select", label: "Seleção" },
  { value: "multiselect", label: "Multi-seleção" },
  { value: "radio", label: "Opções (radio)" },
  { value: "checkbox", label: "Checkbox" },
  { value: "file", label: "Arquivo" },
] as const;

export type ParameterInputType =
  (typeof PARAMETER_INPUT_TYPES)[number]["value"];

export function getParameterInputTypeLabel(type: ParameterInputType): string {
  return (
    PARAMETER_INPUT_TYPES.find((option) => option.value === type)?.label ?? type
  );
}
