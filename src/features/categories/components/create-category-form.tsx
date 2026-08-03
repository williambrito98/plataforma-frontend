import { zodResolver } from "@hookform/resolvers/zod";
import { Tags } from "lucide-react";
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
import { inputClassName } from "@/features/categories/components/categories-form-styles";
import { useCreateCategory } from "@/features/categories/hooks/use-categories-admin";
import {
  categoryNameSchema,
  type CategoryNameFormValues,
} from "@/features/categories/schemas/category-name-schema";

export function CreateCategoryForm() {
  const createCategory = useCreateCategory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryNameFormValues>({
    resolver: zodResolver(categoryNameSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: CategoryNameFormValues) {
    await createCategory.mutateAsync({ name: values.name });
    reset();
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Tags className="size-5" aria-hidden />
          Nova categoria
        </CardTitle>
        <CardDescription>
          Cadastre categorias para organizar as automações da plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 md:grid-cols-[1fr_auto]"
          noValidate
        >
          <Field orientation="vertical" className="gap-2">
            <FieldLabel htmlFor="category-name">Nome</FieldLabel>
            <Input
              id="category-name"
              placeholder="ex.: Fiscal"
              aria-invalid={!!errors.name}
              className={inputClassName}
              {...register("name")}
            />
            <FieldError errors={[errors.name]} />
          </Field>

          <div className="flex items-end justify-end">
            <Button type="submit" loading={createCategory.isPending}>
              Criar categoria
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
