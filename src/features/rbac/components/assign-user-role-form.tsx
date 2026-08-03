import { zodResolver } from "@hookform/resolvers/zod";
import { UserRoundCog } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

import { alertToast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  assignUserRoleSchema,
  NO_ROLE_VALUE,
  type AssignUserRoleFormValues,
} from "@/features/rbac/schemas/assign-user-role-schema";
import {
  useRbacRoles,
  useSetUserRole,
} from "@/features/rbac/hooks/use-rbac-admin";
import { useUsers } from "@/features/users/hooks/use-users";

export function AssignUserRoleForm() {
  const { data: roles = [] } = useRbacRoles();
  const {
    data: users = [],
    isLoading: isUsersLoading,
    isError: isUsersError,
    error: usersError,
  } = useUsers();
  const setUserRole = useSetUserRole();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AssignUserRoleFormValues>({
    resolver: zodResolver(assignUserRoleSchema),
    defaultValues: {
      userId: "",
      roleId: NO_ROLE_VALUE,
    },
  });

  const selectedUserId = watch("userId");

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) ?? null,
    [users, selectedUserId],
  );

  useEffect(() => {
    if (isUsersError) {
      alertToast.error(
        "Erro ao carregar usuários",
        usersError instanceof Error ? usersError.message : undefined,
      );
    }
  }, [isUsersError, usersError]);

  useEffect(() => {
    if (!selectedUser) {
      return;
    }

    setValue("roleId", selectedUser.role?.id ?? NO_ROLE_VALUE);
  }, [selectedUser, setValue]);

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
          Selecione o usuário e o papel desejado. Ao escolher um usuário, o
          papel atual dele é preenchido automaticamente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <Field orientation="vertical" className="gap-2">
            <FieldLabel htmlFor="assign-user-id">Usuário</FieldLabel>
            <Controller
              control={control}
              name="userId"
              render={({ field }) => (
                <Select
                  value={field.value || null}
                  onValueChange={(value) => field.onChange(value ?? "")}
                  disabled={isUsersLoading || users.length === 0}
                  items={users.map((user) => ({
                    label: `${user.name} (${user.email})`,
                    value: user.id,
                  }))}
                >
                  <SelectTrigger
                    id="assign-user-id"
                    className="w-full"
                    aria-invalid={!!errors.userId}
                  >
                    <SelectValue
                      placeholder={
                        isUsersLoading
                          ? "Carregando usuários..."
                          : "Selecione um usuário"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
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
                  items={roles.map((role) => ({
                    label: role.name,
                    value: role.id,
                  }))}
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
            <Button
              type="submit"
              loading={setUserRole.isPending}
              disabled={isUsersLoading || users.length === 0}
            >
              Atualizar papel do usuário
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
