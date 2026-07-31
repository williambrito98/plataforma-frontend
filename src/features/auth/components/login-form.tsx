import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoginActions } from "@/features/auth/components/login-actions";
import { useLogin } from "@/features/auth/hooks/use-login";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/login-schema";

const inputClassName =
  "h-8 border-border bg-secondary px-3 shadow-none rounded-md";

export function LoginForm() {
  const loginMutation = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  function onSubmit(values: LoginFormValues) {
    loginMutation.mutate(values);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-6"
      noValidate
    >
      <p className="text-lg leading-7 font-bold text-foreground">Login</p>

      <Field orientation="vertical" className="gap-2">
        <FieldLabel htmlFor="email" className="font-medium text-sm">
          E-mail
        </FieldLabel>
        <Input
          id="email"
          type="email"
          placeholder="Informe seu e-mail"
          autoComplete="email"
          aria-invalid={!!errors.email}
          className={inputClassName}
          {...register("email")}
        />
        <FieldError errors={[errors.email]} />
      </Field>

      <Field orientation="vertical" className="gap-2">
        <FieldLabel htmlFor="password" className="font-medium text-sm">
          Senha
        </FieldLabel>
        <Input
          id="password"
          type="password"
          placeholder="Informe sua senha"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          className={inputClassName}
          {...register("password")}
        />
        <FieldError errors={[errors.password]} />
      </Field>

      <LoginActions loading={loginMutation.isPending} />
    </form>
  );
}
