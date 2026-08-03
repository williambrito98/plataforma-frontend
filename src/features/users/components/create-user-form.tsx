import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRbacRoles } from "@/features/rbac/hooks/use-rbac-admin";
import { inputClassName } from "@/features/users/components/users-form-styles";
import { useCreateUser } from "@/features/users/hooks/use-users-admin";
import {
  createUserSchema,
  type CreateUserFormValues,
} from "@/features/users/schemas/create-user-schema";

export function CreateUserForm() {
  const { data: roles = [], isLoading: isRolesLoading } = useRbacRoles();
  const createUser = useCreateUser();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      roleId: "",
    },
  });

  async function onSubmit(values: CreateUserFormValues) {
    try {
      await createUser.mutateAsync(values);
      reset();
    } catch {
      // Erro tratado pelo hook via toast.
    }
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <UserPlus className="size-5" aria-hidden />
          Novo usuário
        </CardTitle>
        <CardDescription>
          Cadastre um usuário com nome, e-mail, senha e papel de acesso.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
          noValidate
        >
          <Field orientation="vertical" className="gap-2">
            <FieldLabel htmlFor="user-name">Nome</FieldLabel>
            <Input
              id="user-name"
              placeholder="Maria Souza"
              aria-invalid={!!errors.name}
              className={inputClassName}
              {...register("name")}
            />
            <FieldError errors={[errors.name]} />
          </Field>

          <Field orientation="vertical" className="gap-2">
            <FieldLabel htmlFor="user-email">E-mail</FieldLabel>
            <Input
              id="user-email"
              type="email"
              placeholder="maria@example.com"
              aria-invalid={!!errors.email}
              className={inputClassName}
              {...register("email")}
            />
            <FieldError errors={[errors.email]} />
          </Field>

          <Field orientation="vertical" className="gap-2">
            <FieldLabel htmlFor="user-password">Senha</FieldLabel>
            <Input
              id="user-password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              aria-invalid={!!errors.password}
              className={inputClassName}
              {...register("password")}
            />
            <FieldError errors={[errors.password]} />
          </Field>

          <Field orientation="vertical" className="gap-2">
            <FieldLabel htmlFor="user-role">Papel</FieldLabel>
            <Controller
              control={control}
              name="roleId"
              render={({ field }) => (
                <Select
                  value={field.value || null}
                  onValueChange={(value) => field.onChange(value ?? "")}
                  disabled={isRolesLoading || roles.length === 0}
                  items={roles.map((role) => ({
                    label: role.name,
                    value: role.id,
                  }))}
                >
                  <SelectTrigger
                    id="user-role"
                    className="w-full"
                    aria-invalid={!!errors.roleId}
                  >
                    <SelectValue
                      placeholder={
                        isRolesLoading
                          ? "Carregando papéis..."
                          : "Selecione um papel"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[errors.roleId]} />
          </Field>

          <div className="flex items-end justify-end md:col-span-2 xl:col-span-4">
            <Button type="submit" loading={createUser.isPending}>
              Criar usuário
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
