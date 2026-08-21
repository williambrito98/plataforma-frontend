import { zodResolver } from "@hookform/resolvers/zod";
import { Building2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCreateCompany } from "@/features/companies/hooks/use-create-company";
import {
  createCompanySchema,
  type CreateCompanyFormValues,
} from "@/features/companies/schemas/create-company-schema";

const inputClassName =
  "h-8 border-border bg-background px-3 shadow-none rounded-md";

export function CreateCompanyForm() {
  const createCompany = useCreateCompany();

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
    },
  });

  async function onSubmit(values: CreateCompanyFormValues) {
    try {
      await createCompany.mutateAsync({
        name: values.name.trim(),
        ...(values.document?.trim()
          ? { document: values.document.trim() }
          : {}),
      });
      reset();
    } catch {
      // Erro tratado pelo hook via toast.
    }
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Building2 className="size-5" aria-hidden />
          Nova empresa
        </CardTitle>
        <CardDescription>
          Cadastre uma empresa informando nome e documento (opcional).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
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

          <div className="md:col-span-2">
            <Button type="submit" disabled={createCompany.isPending}>
              {createCompany.isPending ? "Salvando..." : "Cadastrar empresa"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
