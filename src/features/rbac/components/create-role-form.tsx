import { zodResolver } from "@hookform/resolvers/zod";
import { UsersRound } from "lucide-react";
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
  createRoleSchema,
  type CreateRoleFormValues,
} from "@/features/rbac/schemas/create-role-schema";
import { useCreateRole } from "@/features/rbac/hooks/use-rbac-admin";

export function CreateRoleForm() {
  const createRole = useCreateRole();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateRoleFormValues>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: CreateRoleFormValues) {
    await createRole.mutateAsync({
      name: values.name,
      description: values.description || undefined,
    });
    reset();
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <UsersRound className="size-5" aria-hidden />
          Novo papel
        </CardTitle>
        <CardDescription>
          Crie papéis funcionais e depois associe permissões a eles.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 md:grid-cols-2"
          noValidate
        >
          <Field orientation="vertical" className="gap-2">
            <FieldLabel htmlFor="role-name">Nome</FieldLabel>
            <Input
              id="role-name"
              placeholder="ex.: Suporte"
              aria-invalid={!!errors.name}
              className={inputClassName}
              {...register("name")}
            />
            <FieldError errors={[errors.name]} />
          </Field>

          <Field orientation="vertical" className="gap-2 md:col-span-2">
            <FieldLabel htmlFor="role-description">Descrição</FieldLabel>
            <Textarea
              id="role-description"
              placeholder="Explique o escopo operacional deste papel."
              aria-invalid={!!errors.description}
              className={textareaClassName}
              {...register("description")}
            />
            <FieldError errors={[errors.description]} />
          </Field>

          <div className="flex justify-end md:col-span-2">
            <Button type="submit" loading={createRole.isPending}>
              Criar papel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
