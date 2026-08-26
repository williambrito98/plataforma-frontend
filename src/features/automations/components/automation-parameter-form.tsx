import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { alertToast } from "@/components/ui/sonner";
import { AutomationParameterOptionsEditor } from "@/features/automations/components/automation-parameter-options-editor";
import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_MONTH_FORMAT,
  getDefaultTemporalFormat,
  getTemporalFormatValidationError,
} from "@/features/automations/components/field-pickers/date-format";
import {
  PARAMETER_INPUT_TYPES,
  type ParameterInputType,
} from "@/features/automations/config/input-types";
import type { AutomationParameterDraft } from "@/features/automations/types/automation";

const inputClassName =
  "h-8 border-border bg-secondary px-3 shadow-none rounded-md";

const PARAMETER_TYPE_SELECT_ITEMS = [
  { value: "", label: "Selecione" },
  ...PARAMETER_INPUT_TYPES,
];

const OPTION_TYPES = new Set<ParameterInputType>(["select", "multiselect"]);
const TEMPORAL_FORMAT_TYPES = new Set<ParameterInputType>(["date", "month"]);

function createEmptyOptionDraft() {
  return { label: "", value: "" };
}

function isOptionType(
  type: ParameterInputType | "",
): type is ParameterInputType {
  return type !== "" && OPTION_TYPES.has(type);
}

function isTemporalFormatType(
  type: ParameterInputType | "",
): type is "date" | "month" {
  return type !== "" && TEMPORAL_FORMAT_TYPES.has(type);
}

function resolveFormatValidationError(
  type: "date" | "month",
  format: string,
): string | null {
  const formatValue = format.trim() || getDefaultTemporalFormat(type);
  return getTemporalFormatValidationError(type, formatValue);
}

function buildFileAccept(extensionsText: string): string | undefined {
  const extensions = extensionsText
    .split(",")
    .map((extension) => extension.trim().replace(/^\./, "").toLowerCase())
    .filter(Boolean);

  if (!extensions.length) {
    return undefined;
  }

  return extensions
    .map((extension) =>
      extension.startsWith(".") ? extension : `.${extension}`,
    )
    .join(",");
}

type AutomationParameterFormProps = {
  draft: AutomationParameterDraft;
  onDraftChange: (updates: Partial<AutomationParameterDraft>) => void;
  onAdd: (draft: AutomationParameterDraft) => {
    success: boolean;
    error?: string;
  };
};

export function AutomationParameterForm({
  draft,
  onDraftChange,
  onAdd,
}: AutomationParameterFormProps) {
  const [formatError, setFormatError] = useState<string | null>(null);
  const temporalFormatType = isTemporalFormatType(draft.type)
    ? draft.type
    : null;

  function handleAddParameter() {
    if (temporalFormatType) {
      const validationError = resolveFormatValidationError(
        temporalFormatType,
        draft.format,
      );

      if (validationError) {
        setFormatError(validationError);
        alertToast.error("Formato inválido", validationError);
        return;
      }
    }

    setFormatError(null);
    const result = onAdd(draft);

    if (!result.success) {
      if (result.error === "missing-options") {
        alertToast.error(
          "Opções obrigatórias",
          "Informe ao menos uma opção com rótulo e valor.",
        );
        return;
      }

      if (result.error === "missing-template-file") {
        alertToast.error(
          "Arquivo modelo obrigatório",
          "Selecione o arquivo modelo para o parâmetro do tipo arquivo.",
        );
        return;
      }

      if (result.error === "invalid-format") {
        const validationError = temporalFormatType
          ? resolveFormatValidationError(temporalFormatType, draft.format)
          : "Informe um formato válido usando tokens date-fns (ex.: dd/MM/yyyy, MMyyyy).";

        setFormatError(validationError);
        alertToast.error(
          "Formato inválido",
          validationError ?? "Formato inválido.",
        );
        return;
      }

      alertToast.error(
        "Campos obrigatórios",
        "Preencha nome, tipo e rótulo do parâmetro.",
      );
      return;
    }

    alertToast.success("Parâmetro adicionado");
    setFormatError(null);
  }

  function handleTypeChange(value: string | null) {
    setFormatError(null);
    const nextType = (value ?? "") as ParameterInputType | "";

    if (nextType === "file") {
      onDraftChange({
        type: nextType,
        options: [],
        format: "",
        extensionsText: draft.extensionsText,
        templateFileUpload: undefined,
      });
      return;
    }

    if (nextType === "select" || nextType === "multiselect") {
      onDraftChange({
        type: nextType,
        options:
          draft.options.length > 0 ? draft.options : [createEmptyOptionDraft()],
        format: "",
        extensionsText: "",
        templateFileUpload: undefined,
      });
      return;
    }

    if (nextType === "date" || nextType === "month") {
      onDraftChange({
        type: nextType,
        options: [],
        format: getDefaultTemporalFormat(nextType),
        extensionsText: "",
        templateFileUpload: undefined,
      });
      return;
    }

    onDraftChange({
      type: nextType,
      options: [],
      format: "",
      extensionsText: "",
      templateFileUpload: undefined,
    });
  }

  return (
    <div className="space-y-3 rounded-lg bg-muted/30 p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Field orientation="vertical" className="gap-2">
          <FieldLabel htmlFor="parameter-name" className="text-sm font-medium">
            Nome do parâmetro
          </FieldLabel>
          <Input
            id="parameter-name"
            placeholder="Nome do parâmetro"
            className={inputClassName}
            value={draft.name}
            onChange={(event) => onDraftChange({ name: event.target.value })}
          />
        </Field>

        <Field orientation="vertical" className="gap-2">
          <FieldLabel htmlFor="parameter-type" className="text-sm font-medium">
            Tipo
          </FieldLabel>
          <Select
            value={draft.type}
            items={PARAMETER_TYPE_SELECT_ITEMS}
            onValueChange={handleTypeChange}
            defaultValue={""}
          >
            <SelectTrigger
              id="parameter-type"
              size="sm"
              className="w-full border-border bg-secondary shadow-none"
            >
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {PARAMETER_TYPE_SELECT_ITEMS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field orientation="vertical" className="gap-2">
          <FieldLabel htmlFor="parameter-label" className="text-sm font-medium">
            Rótulo do parâmetro
          </FieldLabel>
          <Input
            id="parameter-label"
            placeholder="Rótulo do parâmetro"
            className={inputClassName}
            value={draft.label}
            onChange={(event) => onDraftChange({ label: event.target.value })}
          />
        </Field>
      </div>

      <Field orientation="vertical" className="gap-2">
        <FieldLabel
          htmlFor="parameter-placeholder"
          className="text-sm font-medium"
        >
          Placeholder (opcional)
        </FieldLabel>
        <Input
          id="parameter-placeholder"
          placeholder="Placeholder do parâmetro"
          className={inputClassName}
          value={draft.placeholder}
          onChange={(event) =>
            onDraftChange({ placeholder: event.target.value })
          }
        />
      </Field>

      {isOptionType(draft.type) ? (
        <AutomationParameterOptionsEditor
          options={draft.options}
          onChange={(options) => onDraftChange({ options })}
        />
      ) : null}

      {temporalFormatType ? (
        <Field
          orientation="vertical"
          className="gap-2"
          data-invalid={formatError ? true : undefined}
        >
          <FieldLabel
            htmlFor="parameter-format"
            className="text-sm font-medium"
          >
            Formato
          </FieldLabel>
          <Input
            id="parameter-format"
            placeholder={
              temporalFormatType === "date"
                ? DEFAULT_DATE_FORMAT
                : DEFAULT_MONTH_FORMAT
            }
            className={inputClassName}
            value={draft.format}
            aria-invalid={formatError ? true : undefined}
            onChange={(event) => {
              const nextFormat = event.target.value;
              onDraftChange({ format: nextFormat });

              if (formatError) {
                setFormatError(
                  resolveFormatValidationError(temporalFormatType, nextFormat),
                );
              }
            }}
            onBlur={() => {
              setFormatError(
                resolveFormatValidationError(temporalFormatType, draft.format),
              );
            }}
          />
          <FieldDescription>
            Tokens date-fns. Exemplos: dd/MM/yyyy, MM/yyyy, MMyyyy.
          </FieldDescription>
          {formatError ? <FieldError>{formatError}</FieldError> : null}
        </Field>
      ) : null}

      {draft.type === "file" ? (
        <>
          <Field orientation="vertical" className="gap-2">
            <FieldLabel
              htmlFor="parameter-extensions"
              className="text-sm font-medium"
            >
              Extensões permitidas (opcional)
            </FieldLabel>
            <Input
              id="parameter-extensions"
              placeholder="pdf, xlsx, csv"
              className={inputClassName}
              value={draft.extensionsText}
              onChange={(event) =>
                onDraftChange({ extensionsText: event.target.value })
              }
            />
            <FieldDescription>
              Separe por vírgula. Na execução, o seletor de arquivo mostrará
              apenas essas extensões.
            </FieldDescription>
          </Field>

          <Field orientation="vertical" className="gap-2">
            <FieldLabel
              htmlFor="parameter-template-file"
              className="text-sm font-medium"
            >
              Arquivo modelo
            </FieldLabel>
            <Input
              id="parameter-template-file"
              type="file"
              className={inputClassName}
              accept={buildFileAccept(draft.extensionsText)}
              onChange={(event) =>
                onDraftChange({
                  templateFileUpload: event.target.files?.[0],
                })
              }
            />
            <FieldDescription>
              Arquivo de referência que o usuário poderá baixar na execução.
            </FieldDescription>
          </Field>
        </>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            id="parameter-required"
            checked={draft.required}
            onCheckedChange={(checked) =>
              onDraftChange({ required: checked === true })
            }
          />
          <Label htmlFor="parameter-required" className="cursor-pointer">
            Obrigatório
          </Label>
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={handleAddParameter}
          className="sm:ml-auto"
        >
          <Plus aria-hidden />
          Adicionar parâmetro
        </Button>
      </div>
    </div>
  );
}
