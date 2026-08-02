import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  profileSchema,
  type ProfileFormValues,
} from "@/features/profile/schemas/profile-schema";

const inputClassName =
  "h-8 border-border bg-secondary px-3 shadow-none rounded-md";

type ProfileFormProps = {
  defaultValues: ProfileFormValues;
  isSaving: boolean;
  onSubmit: (values: ProfileFormValues) => Promise<void>;
};

export function ProfileForm({
  defaultValues,
  isSaving,
  onSubmit,
}: ProfileFormProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  async function handleFormSubmit(values: ProfileFormValues) {
    await onSubmit(values);
    reset({
      ...values,
      password: "",
    });
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="mt-4 w-full flex-1 space-y-6 lg:mt-0 lg:w-96"
      noValidate
    >
      <Field orientation="vertical" className="gap-2">
        <FieldLabel htmlFor="company" className="text-sm font-medium">
          Empresa
        </FieldLabel>
        <Input
          id="company"
          placeholder="Sem empresa cadastrada"
          disabled
          className={inputClassName}
          {...register("company")}
        />
        <FieldError errors={[errors.company]} />
      </Field>

      <Field orientation="vertical" className="gap-2">
        <FieldLabel htmlFor="email" className="text-sm font-medium">
          E-mail
        </FieldLabel>
        <Input
          id="email"
          type="email"
          placeholder="E-mail"
          disabled
          className={inputClassName}
          {...register("email")}
        />
        <FieldError errors={[errors.email]} />
      </Field>

      <Field orientation="vertical" className="gap-2">
        <FieldLabel htmlFor="name" className="text-sm font-medium">
          Nome
        </FieldLabel>
        <Input
          id="name"
          placeholder="Nome"
          aria-invalid={!!errors.name}
          className={inputClassName}
          {...register("name")}
        />
        <FieldError errors={[errors.name]} />
      </Field>

      <Field orientation="vertical" className="gap-2">
        <FieldLabel htmlFor="password" className="text-sm font-medium">
          Senha
        </FieldLabel>
        <Input
          id="password"
          type="password"
          placeholder="Senha"
          aria-invalid={!!errors.password}
          className={inputClassName}
          {...register("password")}
        />
        <FieldError errors={[errors.password]} />
      </Field>

      <Button
        type="submit"
        className="mt-6 ml-auto grid justify-self-end"
        loading={isSaving}
      >
        Salvar alterações
      </Button>
    </form>
  );
}
