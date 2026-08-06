import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
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

function createEmptyOptionDraft() {
  return { label: "", value: "" };
}

function isOptionType(
  type: ParameterInputType | "",
): type is ParameterInputType {
  return type !== "" && OPTION_TYPES.has(type);
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
  function handleAddParameter() {
    const result = onAdd(draft);

    if (!result.success) {
      if (result.error === "missing-options") {
        alertToast.error(
          "Opções obrigatórias",
          "Informe ao menos uma opção com rótulo e valor.",
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
  }

  function handleTypeChange(value: string | null) {
    const nextType = (value ?? "") as ParameterInputType | "";

    if (isOptionType(nextType)) {
      onDraftChange({
        type: nextType,
        options:
          draft.options.length > 0 ? draft.options : [createEmptyOptionDraft()],
      });
      return;
    }

    onDraftChange({ type: nextType, options: [] });
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
