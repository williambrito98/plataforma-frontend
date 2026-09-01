import { LoginLogo } from "@/features/auth/components/login-logo";
import { PasswordRecoveryForm } from "@/features/auth/components/password-recovery-form";

export function PasswordRecoveryFormPanel() {
  return (
    <main className="flex flex-1 items-start justify-center overflow-hidden py-24">
      <div className="flex w-80 flex-col gap-16">
        <LoginLogo />
        <PasswordRecoveryForm />
      </div>
    </main>
  );
}
