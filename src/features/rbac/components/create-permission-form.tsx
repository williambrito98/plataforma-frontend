import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  inputClassName,
  textareaClassName,
} from "@/features/rbac/components/rbac-form-styles";
import {
  createPermissionSchema,
  type CreatePermissionFormValues,
} from "@/features/rbac/schemas/create-permission-schema";
import { useCreatePermission } from "@/features/rbac/hooks/use-rbac-admin";

export function CreatePermissionForm() {
  const createPermission = useCreatePermission();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePermissionFormValues>({
    resolver: zodResolver(createPermissionSchema),
    defaultValues: {
      code: "",
      description: "",
    },
  });

  async function onSubmit(values: CreatePermissionFormValues) {
    await createPermission.mutateAsync({
      code: values.code,
      description: values.description || undefined,
    });
    reset();
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <KeyRound className="size-5" aria-hidden />
          Nova permissão
        </CardTitle>
        <CardDescription>
          Cadastre novos códigos consumidos pelo backend e pelo frontend.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 md:grid-cols-2"
          noValidate
        >
          <Field orientation="vertical" className="gap-2">
            <FieldLabel htmlFor="permission-code">Código</FieldLabel>
            <Input
              id="permission-code"
              placeholder="ex.: reports.export"
              aria-invalid={!!errors.code}
              className={inputClassName}
              {...register("code")}
            />
            <FieldError errors={[errors.code]} />
          </Field>

          <Field orientation="vertical" className="gap-2 md:col-span-2">
            <FieldLabel htmlFor="permission-description">Descrição</FieldLabel>
            <Textarea
              id="permission-description"
              placeholder="Explique o que esta permissão libera."
              aria-invalid={!!errors.description}
              className={textareaClassName}
              {...register("description")}
            />
            <FieldError errors={[errors.description]} />
          </Field>

          <div className="flex justify-end md:col-span-2">
            <Button type="submit" loading={createPermission.isPending}>
              Criar permissão
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
