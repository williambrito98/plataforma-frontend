import { useState } from "react";

import { PasswordRecoveryCodeStep } from "@/features/auth/components/password-recovery-code-step";
import { PasswordRecoveryEmailStep } from "@/features/auth/components/password-recovery-email-step";
import { PasswordRecoveryPasswordStep } from "@/features/auth/components/password-recovery-password-step";
import { useConfirmPasswordReset } from "@/features/auth/hooks/use-confirm-password-reset";
import { useRequestPasswordReset } from "@/features/auth/hooks/use-request-password-reset";
import { useVerifyPasswordResetCode } from "@/features/auth/hooks/use-verify-password-reset-code";
import type {
  PasswordRecoveryEmailValues,
  PasswordRecoveryCodeValues,
  PasswordRecoveryPasswordValues,
  PasswordRecoveryStep,
} from "@/features/auth/schemas/password-recovery-schema";

export function PasswordRecoveryForm() {
  const [step, setStep] = useState<PasswordRecoveryStep>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const requestMutation = useRequestPasswordReset();
  const verifyMutation = useVerifyPasswordResetCode();
  const confirmMutation = useConfirmPasswordReset();

  async function handleEmailSubmit(values: PasswordRecoveryEmailValues) {
    await requestMutation.mutateAsync(values.email);
    setEmail(values.email);
    setStep("code");
  }

  async function handleCodeSubmit(values: PasswordRecoveryCodeValues) {
    await verifyMutation.mutateAsync({ email, code: values.code });
    setCode(values.code);
    setStep("password");
  }

  async function handleResendCode() {
    await requestMutation.mutateAsync(email);
  }

  async function handlePasswordSubmit(values: PasswordRecoveryPasswordValues) {
    await confirmMutation.mutateAsync({
      email,
      code,
      password: values.password,
    });
  }

  if (step === "email") {
    return (
      <PasswordRecoveryEmailStep
        defaultEmail={email}
        loading={requestMutation.isPending}
        onSubmit={handleEmailSubmit}
      />
    );
  }

  if (step === "code") {
    return (
      <PasswordRecoveryCodeStep
        email={email}
        loading={verifyMutation.isPending}
        resendLoading={requestMutation.isPending}
        onSubmit={handleCodeSubmit}
        onResend={handleResendCode}
      />
    );
  }

  return (
    <PasswordRecoveryPasswordStep
      loading={confirmMutation.isPending}
      onSubmit={handlePasswordSubmit}
    />
  );
}
