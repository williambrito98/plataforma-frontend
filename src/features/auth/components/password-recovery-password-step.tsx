import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  passwordRecoveryPasswordSchema,
  type PasswordRecoveryPasswordValues,
} from "@/features/auth/schemas/password-recovery-schema";

const inputClassName =
  "h-8 border-border bg-secondary px-3 shadow-none rounded-md";

type PasswordRecoveryPasswordStepProps = {
  loading?: boolean;
  onSubmit: (values: PasswordRecoveryPasswordValues) => void;
};

export function PasswordRecoveryPasswordStep({
  loading = false,
  onSubmit,
}: PasswordRecoveryPasswordStepProps) {
  const form = useForm<PasswordRecoveryPasswordValues>({
    resolver: zodResolver(passwordRecoveryPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
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
          Nova senha
        </p>
        <p className="text-sm leading-5 text-muted-foreground">
          Defina uma nova senha para acessar sua conta.
        </p>
      </div>

      <Field orientation="vertical" className="gap-2">
        <FieldLabel htmlFor="new-password" className="font-medium text-sm">
          Nova senha
        </FieldLabel>
        <Input
          id="new-password"
          type="password"
          placeholder="Informe a nova senha"
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          className={inputClassName}
          {...register("password")}
        />
        <FieldError errors={[errors.password]} />
      </Field>

      <Field orientation="vertical" className="gap-2">
        <FieldLabel
          htmlFor="confirm-new-password"
          className="font-medium text-sm"
        >
          Confirmar senha
        </FieldLabel>
        <Input
          id="confirm-new-password"
          type="password"
          placeholder="Confirme a nova senha"
          autoComplete="new-password"
          aria-invalid={!!errors.confirmPassword}
          className={inputClassName}
          {...register("confirmPassword")}
        />
        <FieldError errors={[errors.confirmPassword]} />
      </Field>

      <div className="flex w-full items-center justify-between">
        <Link
          to="/login"
          className="text-sm leading-5 text-[#737373] hover:underline"
        >
          Voltar ao login
        </Link>
        <Button size="sm" type="submit" loading={loading} disabled={loading}>
          Redefinir senha
        </Button>
      </div>
    </form>
  );
}
