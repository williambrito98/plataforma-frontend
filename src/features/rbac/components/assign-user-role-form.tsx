import { zodResolver } from "@hookform/resolvers/zod";
import { UserRoundCog } from "lucide-react";
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
import { inputClassName } from "@/features/rbac/components/rbac-form-styles";
import {
  assignUserRoleSchema,
  NO_ROLE_VALUE,
  type AssignUserRoleFormValues,
} from "@/features/rbac/schemas/assign-user-role-schema";
import {
  useRbacRoles,
  useSetUserRole,
} from "@/features/rbac/hooks/use-rbac-admin";

export function AssignUserRoleForm() {
  const { data: roles = [] } = useRbacRoles();
  const setUserRole = useSetUserRole();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssignUserRoleFormValues>({
    resolver: zodResolver(assignUserRoleSchema),
    defaultValues: {
      userId: "",
      roleId: NO_ROLE_VALUE,
    },
  });

  async function onSubmit(values: AssignUserRoleFormValues) {
    await setUserRole.mutateAsync({
      userId: values.userId,
      roleId: values.roleId === NO_ROLE_VALUE ? null : values.roleId,
    });
    reset();
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <UserRoundCog className="size-5" aria-hidden />
          Atribuir papel a um usuário
        </CardTitle>
        <CardDescription>
          O backend atual ainda não expõe listagem administrativa de usuários.
          Neste v1, a atribuição é operacional por userId.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <Field orientation="vertical" className="gap-2">
            <FieldLabel htmlFor="assign-user-id">User ID</FieldLabel>
            <Input
              id="assign-user-id"
              placeholder="Informe o ID do usuário"
              aria-invalid={!!errors.userId}
              className={inputClassName}
              {...register("userId")}
            />
            <FieldError errors={[errors.userId]} />
          </Field>

          <Field orientation="vertical" className="gap-2">
            <FieldLabel htmlFor="assign-user-role">Papel</FieldLabel>
            <Controller
              control={control}
              name="roleId"
              render={({ field }) => (
                <Select
                  value={field.value || null}
                  onValueChange={(value) =>
                    field.onChange(value ?? NO_ROLE_VALUE)
                  }
                >
                  <SelectTrigger id="assign-user-role" className="w-full">
                    <SelectValue placeholder="Selecione um papel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_ROLE_VALUE}>Sem papel</SelectItem>
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

          <div className="flex justify-end">
            <Button type="submit" loading={setUserRole.isPending}>
              Atualizar papel do usuário
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
