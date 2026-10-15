import { LoginFormPanel } from "@/features/auth/components/login-form-panel";
import { LoginIllustrationPanel } from "@/features/auth/components/login-illustration-panel";

export function LoginPage() {
  return (
    <div className="flex min-h-screen bg-secondary max-xl:min-h-svh">
      <LoginIllustrationPanel />
      <LoginFormPanel />
    </div>
  );
}
