import { useEffect, useId, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { alertToast } from "@/components/ui/sonner";
import { CompanyAutomationsSection } from "@/features/companies/components/company-automations-section";
import { EditCompanyForm } from "@/features/companies/components/edit-company-form";
import { CompanyMembersSection } from "@/features/companies/components/company-members-section";
import { useCompany } from "@/features/companies/hooks/use-company";
import {
  getLinkedAutomationIds,
  useCompanyExecutions,
} from "@/features/companies/hooks/use-company-executions";
import { useUpdateCompany } from "@/features/companies/hooks/use-update-company";
import type { EditCompanyFormValues } from "@/features/companies/schemas/edit-company-schema";

type EditCompanyPageProps = {
  companyId: string;
};

export function EditCompanyPage({ companyId }: EditCompanyPageProps) {
  const formId = useId();
  const navigate = useNavigate();
  const { data: company, isLoading, isError, error } = useCompany(companyId);
  const {
    data: executions = [],
    isLoading: isExecutionsLoading,
    isError: isExecutionsError,
    error: executionsError,
  } = useCompanyExecutions(companyId);
  const updateCompany = useUpdateCompany();

  const linkedAutomationIds = useMemo(
    () => getLinkedAutomationIds(executions),
    [executions],
  );

  const [selectedAutomationIds, setSelectedAutomationIds] = useState<string[]>(
    [],
  );
  const [hasInitializedAutomations, setHasInitializedAutomations] =
    useState(false);

  useEffect(() => {
    if (isError) {
      alertToast.error(
        "Erro ao carregar empresa",
        error instanceof Error ? error.message : undefined,
      );
    }
  }, [isError, error]);

  useEffect(() => {
    if (isExecutionsError) {
      alertToast.error(
        "Erro ao carregar automações vinculadas",
        executionsError instanceof Error ? executionsError.message : undefined,
      );
    }
  }, [isExecutionsError, executionsError]);

  useEffect(() => {
    if (!hasInitializedAutomations && !isExecutionsLoading) {
      setSelectedAutomationIds(linkedAutomationIds);
      setHasInitializedAutomations(true);
    }
  }, [hasInitializedAutomations, isExecutionsLoading, linkedAutomationIds]);

  async function handleSubmit(values: EditCompanyFormValues): Promise<boolean> {
    const automationIdsChanged =
      selectedAutomationIds.length !== linkedAutomationIds.length ||
      selectedAutomationIds.some(
        (automationId) => !linkedAutomationIds.includes(automationId),
      ) ||
      linkedAutomationIds.some(
        (automationId) => !selectedAutomationIds.includes(automationId),
      );

    try {
      await updateCompany.mutateAsync({
        id: companyId,
        payload: {
          name: values.name.trim(),
          ...(values.document?.trim()
            ? { document: values.document.trim() }
            : {}),
          ...(automationIdsChanged
            ? { automationIds: selectedAutomationIds }
            : {}),
        },
      });

      await navigate({ to: "/empresas" });
      return true;
    } catch {
      return false;
    }
  }

  if (isLoading || isExecutionsLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!company) {
    return (
      <p className="text-sm text-muted-foreground">Empresa não encontrada.</p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <EditCompanyForm
        formId={formId}
        company={company}
        onSubmit={handleSubmit}
      />

      <CompanyAutomationsSection
        selectedAutomationIds={selectedAutomationIds}
        onSelectionChange={setSelectedAutomationIds}
        description="Marque ou desmarque automações para vincular ou desvincular da empresa. Novas seleções geram uma execução inicial."
      />

      <CompanyMembersSection companyId={companyId} />

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate({ to: "/empresas" })}
        >
          Cancelar
        </Button>
        <Button type="submit" form={formId} loading={updateCompany.isPending}>
          Salvar alterações
        </Button>
      </div>
    </div>
  );
}
