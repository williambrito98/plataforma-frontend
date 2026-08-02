import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { alertToast } from "@/components/ui/sonner";
import { NativeSelect } from "@/features/adjust/components/native-select";
import {
  PARAMETER_INPUT_TYPES,
  type ParameterInputType,
} from "@/features/adjust/config/input-types";
import type { AutomationParameterDraft } from "@/features/adjust/types/adjust";

const inputClassName =
  "h-8 border-border bg-secondary px-3 shadow-none rounded-md";

type AdjustParameterFormProps = {
  draft: AutomationParameterDraft;
  onDraftChange: (updates: Partial<AutomationParameterDraft>) => void;
  onAdd: (draft: AutomationParameterDraft) => {
    success: boolean;
    error?: string;
  };
};

export function AdjustParameterForm({
  draft,
  onDraftChange,
  onAdd,
}: AdjustParameterFormProps) {
  function handleAddParameter() {
    const result = onAdd(draft);

    if (!result.success) {
      alertToast.error(
        "Campos obrigatórios",
        "Preencha nome, tipo e rótulo do parâmetro.",
      );
      return;
    }

    alertToast.success("Parâmetro adicionado");
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
          <NativeSelect
            id="parameter-type"
            value={draft.type}
            placeholder="Selecione o tipo"
            onChange={(value) =>
              onDraftChange({ type: value as ParameterInputType | "" })
            }
          >
            {PARAMETER_INPUT_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </NativeSelect>
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
