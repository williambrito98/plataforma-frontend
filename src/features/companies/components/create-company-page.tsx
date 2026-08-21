import { useId } from "react";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { CreateCompanyForm } from "@/features/companies/components/create-company-form";
import { useCreateCompany } from "@/features/companies/hooks/use-create-company";
import type { CreateCompanyFormValues } from "@/features/companies/schemas/create-company-schema";

export function CreateCompanyPage() {
  const formId = useId();
  const navigate = useNavigate();
  const createCompany = useCreateCompany();

  async function handleSubmit(
    values: CreateCompanyFormValues,
  ): Promise<boolean> {
    try {
      await createCompany.mutateAsync({
        name: values.name.trim(),
        ...(values.document?.trim()
          ? { document: values.document.trim() }
          : {}),
        ...(values.automationIds?.length
          ? { automationIds: values.automationIds }
          : {}),
      });

      await navigate({ to: "/empresas" });
      return true;
    } catch {
      return false;
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <CreateCompanyForm formId={formId} onSubmit={handleSubmit} />

      <Button
        type="submit"
        form={formId}
        loading={createCompany.isPending}
        className="ml-auto grid justify-self-end"
      >
        Cadastrar empresa
      </Button>
    </div>
  );
}
