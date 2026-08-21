import { zodResolver } from "@hookform/resolvers/zod";
import { Building2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CompanyAutomationsSection } from "@/features/companies/components/company-automations-section";
import {
  createCompanySchema,
  type CreateCompanyFormValues,
} from "@/features/companies/schemas/create-company-schema";

const inputClassName =
  "h-8 border-border bg-background px-3 shadow-none rounded-md";

type CreateCompanyFormProps = {
  formId: string;
  onSubmit: (values: CreateCompanyFormValues) => Promise<boolean>;
};

export function CreateCompanyForm({
  formId,
  onSubmit,
}: CreateCompanyFormProps) {
  const [selectedAutomationIds, setSelectedAutomationIds] = useState<string[]>(
    [],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCompanyFormValues>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      name: "",
      document: "",
      automationIds: [],
    },
  });

  function toggleAutomationSelection(automationIds: string[]) {
    setSelectedAutomationIds(automationIds);
  }

  async function handleFormSubmit(values: CreateCompanyFormValues) {
    const shouldReset = await onSubmit({
      ...values,
      automationIds: selectedAutomationIds,
    });

    if (shouldReset) {
      reset();
      setSelectedAutomationIds([]);
    }
  }

  return (
    <div className="mx-auto w-full space-y-6">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Building2 className="size-5" aria-hidden />
            Dados da empresa
          </CardTitle>
          <CardDescription>
            Informe o nome e, se houver, o documento da empresa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id={formId}
            onSubmit={handleSubmit(handleFormSubmit)}
            className="grid gap-4 md:grid-cols-2"
            noValidate
          >
            <Field orientation="vertical" className="gap-2">
              <FieldLabel htmlFor="company-name">Nome</FieldLabel>
              <Input
                id="company-name"
                placeholder="Acme Ltda"
                aria-invalid={!!errors.name}
                className={inputClassName}
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field orientation="vertical" className="gap-2">
              <FieldLabel htmlFor="company-document">Documento</FieldLabel>
              <Input
                id="company-document"
                placeholder="12.345.678/0001-90"
                aria-invalid={!!errors.document}
                className={inputClassName}
                {...register("document")}
              />
              <FieldError errors={[errors.document]} />
            </Field>
          </form>
        </CardContent>
      </Card>

      <CompanyAutomationsSection
        selectedAutomationIds={selectedAutomationIds}
        onSelectionChange={toggleAutomationSelection}
      />
    </div>
  );
}
