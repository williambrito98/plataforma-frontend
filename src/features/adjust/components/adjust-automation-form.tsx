import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  adjustSchema,
  type AdjustFormValues,
} from "@/features/adjust/schemas/adjust-schema";

const inputClassName =
  "h-8 border-border bg-secondary px-3 shadow-none rounded-md";

type AdjustAutomationFormProps = {
  formId: string;
  onSubmit: (values: AdjustFormValues) => Promise<boolean>;
};

export function AdjustAutomationForm({
  formId,
  onSubmit,
}: AdjustAutomationFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdjustFormValues>({
    resolver: zodResolver(adjustSchema),
    defaultValues: {
      name: "",
      description: "",
      path: "",
    },
  });

  async function handleFormSubmit(values: AdjustFormValues) {
    const success = await onSubmit(values);

    if (success) {
      reset();
    }
  }

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(handleFormSubmit)}
      className="grid grid-cols-1 gap-4 md:grid-cols-3"
      noValidate
    >
      <Field orientation="vertical" className="gap-2">
        <FieldLabel htmlFor="automation-name" className="text-sm font-medium">
          Nome da automação
        </FieldLabel>
        <Input
          id="automation-name"
          placeholder="Nome da automação"
          aria-invalid={!!errors.name}
          className={inputClassName}
          {...register("name")}
        />
        <FieldError errors={[errors.name]} />
      </Field>

      <Field orientation="vertical" className="gap-2">
        <FieldLabel
          htmlFor="automation-description"
          className="text-sm font-medium"
        >
          Descrição
        </FieldLabel>
        <Input
          id="automation-description"
          placeholder="Descrição da automação"
          aria-invalid={!!errors.description}
          className={inputClassName}
          {...register("description")}
        />
        <FieldError errors={[errors.description]} />
      </Field>

      <Field orientation="vertical" className="gap-2">
        <FieldLabel htmlFor="automation-path" className="text-sm font-medium">
          Caminho
        </FieldLabel>
        <Input
          id="automation-path"
          placeholder="Caminho da automação"
          aria-invalid={!!errors.path}
          className={inputClassName}
          {...register("path")}
        />
        <FieldError errors={[errors.path]} />
      </Field>
    </form>
  );
}

export type { AdjustFormValues };
