import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { alertToast } from "@/components/ui/sonner";
import { useCategories } from "@/features/categories/hooks/use-categories";
import {
  createAutomationSchema,
  type CreateAutomationFormValues,
} from "@/features/automations/schemas/create-automation-schema";

const inputClassName =
  "h-8 border-border bg-secondary px-3 shadow-none rounded-md";

type CreateAutomationFormProps = {
  formId: string;
  defaultValues?: CreateAutomationFormValues;
  resetOnSuccess?: boolean;
  onSubmit: (values: CreateAutomationFormValues) => Promise<boolean>;
};

export function CreateAutomationForm({
  formId,
  defaultValues,
  resetOnSuccess = true,
  onSubmit,
}: CreateAutomationFormProps) {
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useCategories();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAutomationFormValues>({
    resolver: zodResolver(createAutomationSchema),
    defaultValues: defaultValues ?? {
      name: "",
      description: "",
      path: "",
      categoryId: "",
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  useEffect(() => {
    if (isCategoriesError) {
      alertToast.error(
        "Erro ao carregar categorias",
        categoriesError instanceof Error ? categoriesError.message : undefined,
      );
    }
  }, [isCategoriesError, categoriesError]);

  async function handleFormSubmit(values: CreateAutomationFormValues) {
    const success = await onSubmit(values);

    if (success && resetOnSuccess) {
      reset();
    }
  }

  const categoryPlaceholder = isCategoriesLoading
    ? "Carregando categorias..."
    : "Selecione uma categoria";

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(handleFormSubmit)}
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
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

      <Field orientation="vertical" className="gap-2">
        <FieldLabel
          htmlFor="automation-category"
          className="text-sm font-medium"
        >
          Categoria
        </FieldLabel>
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <Select
              value={field.value || null}
              onValueChange={(value) => field.onChange(value ?? "")}
              disabled={isCategoriesLoading || categories.length === 0}
              items={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            >
              <SelectTrigger
                id="automation-category"
                size="sm"
                className="w-full border-border bg-secondary shadow-none"
                aria-invalid={!!errors.categoryId}
              >
                <SelectValue placeholder={categoryPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError errors={[errors.categoryId]} />
      </Field>
    </form>
  );
}

export type { CreateAutomationFormValues };
