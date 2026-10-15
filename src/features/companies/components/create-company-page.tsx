import { useId, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { CompanyBrandingSection } from "@/features/companies/components/company-branding-section";
import { CreateCompanyForm } from "@/features/companies/components/create-company-form";
import { useCreateCompany } from "@/features/companies/hooks/use-create-company";
import type { CreateCompanyFormValues } from "@/features/companies/schemas/create-company-schema";
import {
  DEFAULT_COMPANY_BRANDING,
  type CompanyBrandingValues,
} from "@/features/companies/types/company-theme";

export function CreateCompanyPage() {
  const formId = useId();
  const navigate = useNavigate();
  const createCompany = useCreateCompany();
  const [branding, setBranding] = useState<CompanyBrandingValues>(
    DEFAULT_COMPANY_BRANDING,
  );

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
        ...(branding.clearTheme || branding.theme
          ? { theme: branding.clearTheme ? null : branding.theme }
          : {}),
        ...(branding.logoFile ? { logo: branding.logoFile } : {}),
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

      <CompanyBrandingSection value={branding} onChange={setBranding} />

      {/* Abaixo de md a ação principal fica fixa no rodapé, sempre visível */}
      <div className="flex flex-col max-md:sticky max-md:bottom-0 max-md:z-10 max-md:-mx-4 max-md:border-t max-md:border-border max-md:bg-background/95 max-md:px-4 max-md:py-3 max-md:backdrop-blur">
        <Button
          type="submit"
          form={formId}
          loading={createCompany.isPending}
          className="ml-auto grid justify-self-end max-md:ml-0 max-md:h-11"
        >
          Cadastrar empresa
        </Button>
      </div>
    </div>
  );
}
