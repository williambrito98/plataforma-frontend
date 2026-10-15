import { LoginIllustration } from "@/features/auth/components/login-illustration";
import { LoginSiteLink } from "@/features/auth/components/login-site-link";

export function LoginIllustrationPanel() {
  return (
    <aside className="hidden w-135 shrink-0 flex-col items-center overflow-hidden bg-background pt-28 xl:flex">
      <LoginIllustration />
      <LoginSiteLink />
    </aside>
  );
}
