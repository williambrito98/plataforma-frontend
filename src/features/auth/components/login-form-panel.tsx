import { LoginForm } from "@/features/auth/components/login-form";
import { LoginLogo } from "@/features/auth/components/login-logo";

export function LoginFormPanel() {
  return (
    <main className="flex flex-1 items-start justify-center overflow-hidden py-24">
      <div className="flex w-80 flex-col gap-16">
        <LoginLogo />
        <LoginForm />
      </div>
    </main>
  );
}
