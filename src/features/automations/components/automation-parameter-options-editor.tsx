import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { AutomationParameterOption } from "../types/automation";

const inputClassName =
  "h-8 border-border bg-secondary px-3 shadow-none rounded-md";

type AutomationParameterOptionsEditorProps = {
  options: AutomationParameterOption[];
  onChange: (options: AutomationParameterOption[]) => void;
};

export function AutomationParameterOptionsEditor({
  options,
  onChange,
}: AutomationParameterOptionsEditorProps) {
  function updateOption(
    index: number,
    field: keyof AutomationParameterOption,
    value: string,
  ) {
    onChange(
      options.map((option, optionIndex) =>
        optionIndex === index ? { ...option, [field]: value } : option,
      ),
    );
  }

  function removeOption(index: number) {
    if (options.length <= 1) {
      return;
    }

    onChange(options.filter((_, optionIndex) => optionIndex !== index));
  }

  function addOption() {
    onChange([...options, { label: "", value: "" }]);
  }

  return (
    <div className="space-y-3">
      <FieldLabel className="text-sm font-medium">Opções</FieldLabel>

      <div className="space-y-2">
        {options.map((option, index) => (
          <div
            key={index}
            className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]"
          >
            <Field orientation="vertical" className="gap-2">
              <FieldLabel
                htmlFor={`parameter-option-label-${index}`}
                className="text-xs font-medium text-muted-foreground"
              >
                Rótulo
              </FieldLabel>
              <Input
                id={`parameter-option-label-${index}`}
                placeholder="Rótulo da opção"
                className={inputClassName}
                value={option.label}
                onChange={(event) =>
                  updateOption(index, "label", event.target.value)
                }
              />
            </Field>

            <Field orientation="vertical" className="gap-2">
              <FieldLabel
                htmlFor={`parameter-option-value-${index}`}
                className="text-xs font-medium text-muted-foreground"
              >
                Valor
              </FieldLabel>
              <Input
                id={`parameter-option-value-${index}`}
                placeholder="Valor da opção"
                className={inputClassName}
                value={option.value}
                onChange={(event) =>
                  updateOption(index, "value", event.target.value)
                }
              />
            </Field>

            <div className="flex items-end">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Remover opção ${index + 1}`}
                disabled={options.length <= 1}
                onClick={() => removeOption(index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 aria-hidden />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button type="button" variant="outline" size="sm" onClick={addOption}>
        <Plus aria-hidden />
        Adicionar opção
      </Button>
    </div>
  );
}
