import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ProfileAvatarSection } from "@/features/profile/components/profile-avatar-section";
import { useRbacRoles } from "@/features/rbac/hooks/use-rbac-admin";
import { inputClassName } from "@/features/users/components/users-form-styles";
import {
  useUpdateUserAdmin,
  useUpdateUserPhoto,
} from "@/features/users/hooks/use-users-admin";
import {
  NO_ROLE_VALUE,
  updateUserSchema,
  type UpdateUserFormValues,
} from "@/features/users/schemas/update-user-schema";
import type { UserListItem } from "@/features/users/types/user";

type EditUserSheetProps = {
  user: UserListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditUserSheet({
  user,
  open,
  onOpenChange,
}: EditUserSheetProps) {
  const { data: roles = [] } = useRbacRoles();
  const updateUserAdmin = useUpdateUserAdmin();
  const updateUserPhoto = useUpdateUserPhoto();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      roleId: NO_ROLE_VALUE,
    },
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    reset({
      name: user.name,
      email: user.email,
      password: "",
      roleId: user.role?.id ?? NO_ROLE_VALUE,
    });
  }, [user, reset]);

  async function onSubmit(values: UpdateUserFormValues) {
    if (!user) {
      return;
    }

    const payload: {
      name: string;
      email: string;
      password?: string;
      roleId: string | null;
    } = {
      name: values.name,
      email: values.email,
      roleId: values.roleId === NO_ROLE_VALUE ? null : values.roleId,
    };

    if (values.password) {
      payload.password = values.password;
    }

    try {
      await updateUserAdmin.mutateAsync({ id: user.id, payload });
      onOpenChange(false);
    } catch {
      // Erro tratado pelo hook via toast.
    }
  }

  async function handlePhotoUpload(file: File) {
    if (!user) {
      return;
    }

    await updateUserPhoto.mutateAsync({ id: user.id, file });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Editar usuário</SheetTitle>
          <SheetDescription>
            Atualize os dados de acesso e o papel do usuário selecionado.
          </SheetDescription>
        </SheetHeader>

        {user ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-1 flex-col gap-6 px-4"
            noValidate
          >
            <ProfileAvatarSection
              name={user.name}
              avatar={user.profilePhotoUrl ?? undefined}
              onPhotoUpload={handlePhotoUpload}
            />

            <Field orientation="vertical" className="gap-2">
              <FieldLabel htmlFor="edit-user-name">Nome</FieldLabel>
              <Input
                id="edit-user-name"
                placeholder="Nome"
                aria-invalid={!!errors.name}
                className={inputClassName}
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field orientation="vertical" className="gap-2">
              <FieldLabel htmlFor="edit-user-email">E-mail</FieldLabel>
              <Input
                id="edit-user-email"
                type="email"
                placeholder="E-mail"
                aria-invalid={!!errors.email}
                className={inputClassName}
                {...register("email")}
              />
              <FieldError errors={[errors.email]} />
            </Field>

            <Field orientation="vertical" className="gap-2">
              <FieldLabel htmlFor="edit-user-password">Senha</FieldLabel>
              <Input
                id="edit-user-password"
                type="password"
                placeholder="Deixe em branco para manter"
                aria-invalid={!!errors.password}
                className={inputClassName}
                {...register("password")}
              />
              <FieldError errors={[errors.password]} />
            </Field>

            <Field orientation="vertical" className="gap-2">
              <FieldLabel htmlFor="edit-user-role">Papel</FieldLabel>
              <Controller
                control={control}
                name="roleId"
                render={({ field }) => (
                  <Select
                    value={field.value || null}
                    onValueChange={(value) =>
                      field.onChange(value ?? NO_ROLE_VALUE)
                    }
                    items={[
                      { label: "Sem papel", value: NO_ROLE_VALUE },
                      ...roles.map((role) => ({
                        label: role.name,
                        value: role.id,
                      })),
                    ]}
                  >
                    <SelectTrigger id="edit-user-role" className="w-full">
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

            <SheetFooter className="px-0">
              <Button
                type="button"
                variant="outline"
                disabled={updateUserAdmin.isPending}
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" loading={updateUserAdmin.isPending}>
                Salvar alterações
              </Button>
            </SheetFooter>
          </form>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
