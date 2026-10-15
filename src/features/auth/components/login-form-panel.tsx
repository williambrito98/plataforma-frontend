import {
  useAuthUser,
  useIsAuthenticated,
} from "@/features/auth/stores/auth-store";
import { LoginCompanyPanel } from "@/features/auth/components/login-company-panel";
import { LoginForm } from "@/features/auth/components/login-form";
import { LoginLogo } from "@/features/auth/components/login-logo";
import {
  getUserCompanies,
  needsCompanySelection,
} from "@/features/companies/lib/company-selection";
import { useSelectedCompanyId } from "@/features/companies/stores/company-store";

export function LoginFormPanel() {
  const isAuthenticated = useIsAuthenticated();
  const user = useAuthUser();
  const selectedCompanyId = useSelectedCompanyId();
  const companies = getUserCompanies(user);
  const showCompanySelection =
    isAuthenticated &&
    needsCompanySelection(user) &&
    !selectedCompanyId &&
    companies.length > 1;

  if (showCompanySelection) {
    return <LoginCompanyPanel />;
  }

  return (
    <main className="flex flex-1 items-start justify-center overflow-hidden py-24 max-xl:items-center max-xl:px-4 max-xl:py-12">
      <div className="flex w-full max-w-80 flex-col gap-16 max-xl:gap-10">
        <LoginLogo />
        <LoginForm />
      </div>
    </main>
  );
}
