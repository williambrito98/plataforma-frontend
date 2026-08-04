import { zodResolver } from "@hookform/resolvers/zod";
import { Play } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { DynamicAutomationField } from "@/features/automations/components/dynamic-automation-field";
import {
  buildParameterDefaultValues,
  buildParametersSchema,
  normalizeParameterValues,
} from "@/features/automations/schemas/automation-parameters-schema";
import type { AutomationParameter } from "@/features/automations/types/automation";

type AutomationIdleFormProps = {
  fields: AutomationParameter[];
  onStart: (submittedValues: Record<string, string>) => void;
};

export function AutomationIdleForm({
  fields,
  onStart,
}: AutomationIdleFormProps) {
  const schema = useMemo(() => buildParametersSchema(fields), [fields]);
  const defaultValues = useMemo(
    () => buildParameterDefaultValues(fields),
    [fields],
  );

  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  function handleStart(values: Record<string, unknown>) {
    onStart(normalizeParameterValues(fields, values));
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(handleStart)}>
      <div className="space-y-1">
        <h4 className="text-sm font-medium text-foreground">
          Preencha os dados para iniciar
        </h4>
        <p className="text-sm text-muted-foreground">
          Informe os parâmetros necessários antes de executar a automação
        </p>
      </div>

      <div className="grid gap-4">
        {fields.map((parameter) => (
          <DynamicAutomationField
            key={parameter.id}
            parameter={parameter}
            control={control}
            errors={errors}
          />
        ))}
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={!isValid}>
          <Play aria-hidden />
          Iniciar
        </Button>
      </div>
    </form>
  );
}
