import { useId, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { alertToast } from "@/components/ui/sonner";
import { createAutomationMock } from "@/features/automations/api/create-automation";
import { AutomationParameterForm } from "@/features/automations/components/automation-parameter-form";
import { AutomationParameterList } from "@/features/automations/components/automation-parameter-list";
import { CreateAutomationForm } from "@/features/automations/components/create-automation-form";
import { useAutomationParameters } from "@/features/automations/hooks/use-automation-parameters";
import type { CreateAutomationFormValues } from "@/features/automations/schemas/create-automation-schema";

export function CreateAutomationPage() {
  const formId = useId();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const {
    parameters,
    draft,
    addParameter,
    removeParameter,
    clearParameters,
    updateDraft,
  } = useAutomationParameters();

  async function handleSubmit(
    values: CreateAutomationFormValues,
  ): Promise<boolean> {
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
      await navigate({ to: "/automacoes" });
      return true;
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto w-full space-y-6">
        <CreateAutomationForm formId={formId} onSubmit={handleSubmit} />

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base text-foreground">
              Parâmetros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AutomationParameterForm
              draft={draft}
              onDraftChange={updateDraft}
              onAdd={addParameter}
            />
            <AutomationParameterList
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
          Criar automação
        </Button>
      </div>
    </div>
  );
}
