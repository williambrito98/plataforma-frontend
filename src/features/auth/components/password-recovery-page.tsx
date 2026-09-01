import { LoginIllustrationPanel } from "@/features/auth/components/login-illustration-panel";
import { PasswordRecoveryFormPanel } from "@/features/auth/components/password-recovery-form-panel";

export function PasswordRecoveryPage() {
  return (
    <div className="flex min-h-screen bg-secondary">
      <LoginIllustrationPanel />
      <PasswordRecoveryFormPanel />
    </div>
  );
}
