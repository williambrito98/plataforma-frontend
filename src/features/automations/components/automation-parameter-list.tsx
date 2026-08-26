import { Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getParameterInputTypeLabel } from "@/features/automations/config/input-types";
import type { AutomationParameter } from "@/features/automations/types/automation";

type AutomationParameterListProps = {
  parameters: AutomationParameter[];
  onRemove: (id: string) => void;
};

export function AutomationParameterList({
  parameters,
  onRemove,
}: AutomationParameterListProps) {
  if (parameters.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {parameters.map((parameter) => (
        <div
          key={parameter.id}
          className="flex items-start justify-between gap-3 rounded-lg bg-muted/50 p-3"
        >
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium text-foreground">
                {parameter.label}
              </p>
              {parameter.required ? (
                <Badge variant="error">Obrigatório</Badge>
              ) : null}
            </div>
            <p className="text-sm text-muted-foreground">
              {parameter.name} • {getParameterInputTypeLabel(parameter.type)}
            </p>
            {parameter.placeholder ? (
              <p className="text-xs text-muted-foreground">
                Placeholder: {parameter.placeholder}
              </p>
            ) : null}
            {parameter.options?.length ? (
              <p className="text-xs text-muted-foreground">
                Opções:{" "}
                {parameter.options
                  .map((option) => `${option.label} (${option.value})`)
                  .join(", ")}
              </p>
            ) : null}
            {parameter.type === "file" && parameter.extensions?.length ? (
              <p className="text-xs text-muted-foreground">
                Extensões:{" "}
                {parameter.extensions
                  .map((extension) =>
                    extension.startsWith(".") ? extension : `.${extension}`,
                  )
                  .join(", ")}
              </p>
            ) : null}
            {(parameter.type === "date" || parameter.type === "month") &&
            parameter.format ? (
              <p className="text-xs text-muted-foreground">
                Formato: {parameter.format}
              </p>
            ) : null}
            {parameter.type === "file" &&
            (parameter.templateFileUpload || parameter.templateFile) ? (
              <p className="text-xs text-muted-foreground">
                Modelo:{" "}
                {parameter.templateFileUpload?.name ??
                  parameter.templateFile?.name}
              </p>
            ) : null}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Remover parâmetro ${parameter.label}`}
            onClick={() => onRemove(parameter.id)}
            className="shrink-0 text-destructive hover:text-destructive"
          >
            <Trash2 aria-hidden />
          </Button>
        </div>
      ))}
    </div>
  );
}
