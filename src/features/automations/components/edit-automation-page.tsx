import { useEffect, useId, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { alertToast } from "@/components/ui/sonner";
import { AutomationParameterForm } from "@/features/automations/components/automation-parameter-form";
import { AutomationParameterList } from "@/features/automations/components/automation-parameter-list";
import { CreateAutomationForm } from "@/features/automations/components/create-automation-form";
import { useAutomation } from "@/features/automations/hooks/use-automation";
import { useAutomationParameters } from "@/features/automations/hooks/use-automation-parameters";
import { useUpdateAutomation } from "@/features/automations/hooks/use-update-automation";
import type { CreateAutomationFormValues } from "@/features/automations/schemas/create-automation-schema";
import { parseAutomationFields } from "@/features/automations/utils/parse-automation-fields";

type EditAutomationPageProps = {
  automationId: string;
};

export function EditAutomationPage({ automationId }: EditAutomationPageProps) {
  const formId = useId();
  const navigate = useNavigate();
  const {
    data: automation,
    isLoading,
    isError,
    error,
  } = useAutomation(automationId);
  const updateAutomation = useUpdateAutomation();
  const {
    parameters,
    draft,
    addParameter,
    removeParameter,
    setParameters,
    updateDraft,
  } = useAutomationParameters();
  const [hasInitializedParameters, setHasInitializedParameters] =
    useState(false);

  const defaultValues = useMemo<CreateAutomationFormValues | undefined>(() => {
    if (!automation) {
      return undefined;
    }

    return {
      name: automation.name,
      description: automation.description ?? "",
      path: automation.path,
      categoryId: automation.category.id,
    };
  }, [automation]);

  useEffect(() => {
    if (isError) {
      alertToast.error(
        "Erro ao carregar automação",
        error instanceof Error ? error.message : undefined,
      );
    }
  }, [isError, error]);

  useEffect(() => {
    if (automation && !hasInitializedParameters) {
      setParameters(parseAutomationFields(automation.fields));
      setHasInitializedParameters(true);
    }
  }, [automation, hasInitializedParameters, setParameters]);

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

    try {
      await updateAutomation.mutateAsync({
        id: automationId,
        payload: {
          ...values,
          fields: parameters,
        },
      });

      await navigate({ to: "/automacoes" });
      return true;
    } catch {
      return false;
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!automation || !defaultValues) {
    return (
      <p className="text-sm text-muted-foreground">Automação não encontrada.</p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto w-full space-y-6">
        <CreateAutomationForm
          formId={formId}
          defaultValues={defaultValues}
          resetOnSuccess={false}
          onSubmit={handleSubmit}
        />

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

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: "/automacoes" })}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form={formId}
            loading={updateAutomation.isPending}
            disabled={parameters.length === 0}
          >
            Salvar alterações
          </Button>
        </div>
      </div>
    </div>
  );
}
