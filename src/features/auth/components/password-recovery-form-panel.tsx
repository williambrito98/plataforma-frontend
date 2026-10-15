import { LoginLogo } from "@/features/auth/components/login-logo";
import { PasswordRecoveryForm } from "@/features/auth/components/password-recovery-form";

export function PasswordRecoveryFormPanel() {
  return (
    <main className="flex flex-1 items-start justify-center overflow-hidden py-24 max-xl:items-center max-xl:px-4 max-xl:py-12">
      <div className="flex w-full max-w-80 flex-col gap-16 max-xl:gap-10">
        <LoginLogo />
        <PasswordRecoveryForm />
      </div>
    </main>
  );
}
