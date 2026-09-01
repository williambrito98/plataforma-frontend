import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  passwordRecoveryEmailSchema,
  type PasswordRecoveryEmailValues,
} from "@/features/auth/schemas/password-recovery-schema";

const inputClassName =
  "h-8 border-border bg-secondary px-3 shadow-none rounded-md";

type PasswordRecoveryEmailStepProps = {
  defaultEmail?: string;
  loading?: boolean;
  onSubmit: (values: PasswordRecoveryEmailValues) => void;
};

export function PasswordRecoveryEmailStep({
  defaultEmail = "",
  loading = false,
  onSubmit,
}: PasswordRecoveryEmailStepProps) {
  const form = useForm<PasswordRecoveryEmailValues>({
    resolver: zodResolver(passwordRecoveryEmailSchema),
    defaultValues: {
      email: defaultEmail,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-6"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <p className="text-lg leading-7 font-bold text-foreground">
          Recuperar senha
        </p>
        <p className="text-sm leading-5 text-muted-foreground">
          Informe seu e-mail para receber um código de recuperação.
        </p>
      </div>

      <Field orientation="vertical" className="gap-2">
        <FieldLabel htmlFor="recovery-email" className="font-medium text-sm">
          E-mail
        </FieldLabel>
        <Input
          id="recovery-email"
          type="email"
          placeholder="Informe seu e-mail"
          autoComplete="email"
          aria-invalid={!!errors.email}
          className={inputClassName}
          {...register("email")}
        />
        <FieldError errors={[errors.email]} />
      </Field>

      <div className="flex w-full items-center justify-between">
        <Link
          to="/login"
          className="text-sm leading-5 text-[#737373] hover:underline"
        >
          Voltar ao login
        </Link>
        <Button size="sm" type="submit" loading={loading} disabled={loading}>
          Enviar código
        </Button>
      </div>
    </form>
  );
}
