import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { alertToast } from "@/components/ui/sonner";
import { AdjustAutomationForm } from "@/features/adjust/components/adjust-automation-form";
import { AdjustParameterForm } from "@/features/adjust/components/adjust-parameter-form";
import { AdjustParameterList } from "@/features/adjust/components/adjust-parameter-list";
import { useAdjustParameters } from "@/features/adjust/hooks/use-adjust-parameters";
import { createAutomationMock } from "@/features/adjust/api/create-automation";
import type { AdjustFormValues } from "@/features/adjust/schemas/adjust-schema";

export function AdjustPage() {
  const formId = useId();
  const [isSaving, setIsSaving] = useState(false);
  const {
    parameters,
    draft,
    addParameter,
    removeParameter,
    clearParameters,
    updateDraft,
  } = useAdjustParameters();

  async function handleSubmit(values: AdjustFormValues): Promise<boolean> {
    if (parameters.length === 0) {
      alertToast.error(
        "Parâmetros obrigatórios",
        "Adicione pelo menos um parâmetro.",
      );
      return false;
    }

    setIsSaving(true);

    try {
      await createAutomationMock({
        ...values,
        fields: parameters,
      });

      clearParameters();
      alertToast.success(
        "Automação criada",
        "Configurações salvas com sucesso.",
      );
      return true;
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto w-full space-y-6">
        <AdjustAutomationForm formId={formId} onSubmit={handleSubmit} />

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base text-foreground">
              Parâmetros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AdjustParameterForm
              draft={draft}
              onDraftChange={updateDraft}
              onAdd={addParameter}
            />
            <AdjustParameterList
              parameters={parameters}
              onRemove={removeParameter}
            />
          </CardContent>
        </Card>

        <Button
          type="submit"
          form={formId}
          loading={isSaving}
          disabled={parameters.length === 0}
          className="ml-auto grid justify-self-end"
        >
          Salvar configurações
        </Button>
      </div>
    </div>
  );
}
