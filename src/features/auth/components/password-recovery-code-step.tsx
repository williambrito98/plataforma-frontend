import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  passwordRecoveryCodeSchema,
  type PasswordRecoveryCodeValues,
} from "@/features/auth/schemas/password-recovery-schema";

type PasswordRecoveryCodeStepProps = {
  email: string;
  loading?: boolean;
  resendLoading?: boolean;
  onSubmit: (values: PasswordRecoveryCodeValues) => void;
  onResend: () => void;
};

const RESEND_COOLDOWN_SECONDS = 60;

export function PasswordRecoveryCodeStep({
  email,
  loading = false,
  resendLoading = false,
  onSubmit,
  onResend,
}: PasswordRecoveryCodeStepProps) {
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setCooldown((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldown]);

  const form = useForm<PasswordRecoveryCodeValues>({
    resolver: zodResolver(passwordRecoveryCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  function handleResend() {
    onResend();
    setCooldown(RESEND_COOLDOWN_SECONDS);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-6"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <p className="text-lg leading-7 font-bold text-foreground">
          Informe o código
        </p>
        <p className="text-sm leading-5 text-muted-foreground">
          Enviamos um código de 6 dígitos para{" "}
          <span className="font-medium text-foreground">{email}</span>.
        </p>
      </div>

      <Field orientation="vertical" className="gap-2">
        <FieldLabel className="font-medium text-sm">Código</FieldLabel>
        <Controller
          control={control}
          name="code"
          render={({ field }) => (
            <InputOTP
              maxLength={6}
              value={field.value}
              onChange={field.onChange}
              aria-invalid={!!errors.code}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          )}
        />
        <FieldError errors={[errors.code]} />
      </Field>

      <div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="self-start px-0 text-[#737373] hover:bg-transparent"
          disabled={cooldown > 0 || resendLoading}
          loading={resendLoading}
          onClick={handleResend}
        >
          {cooldown > 0 ? `Reenviar código em ${cooldown}s` : "Reenviar código"}
        </Button>

        <div className="flex w-full items-center justify-between">
          <Link
            to="/login"
            className="text-sm leading-5 text-[#737373] hover:underline"
          >
            Voltar ao login
          </Link>
          <Button size="sm" type="submit" loading={loading} disabled={loading}>
            Continuar
          </Button>
        </div>
      </div>
    </form>
  );
}
