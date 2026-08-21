import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

import { useAuthUser } from "@/features/auth/stores/auth-store";
import {
  getUserCompanies,
  needsCompanySelection,
} from "@/features/companies/lib/company-selection";
import { useSelectedCompanyId } from "@/features/companies/stores/company-store";

type RequireCompanySelectionProps = {
  children: React.ReactNode;
};

export function RequireCompanySelection({
  children,
}: RequireCompanySelectionProps) {
  const navigate = useNavigate();
  const user = useAuthUser();
  const selectedCompanyId = useSelectedCompanyId();
  const companies = getUserCompanies(user);
  const mustSelectCompany =
    needsCompanySelection(user) && !selectedCompanyId && companies.length > 1;

  useEffect(() => {
    if (mustSelectCompany) {
      void navigate({ to: "/login", replace: true });
    }
  }, [mustSelectCompany, navigate]);

  if (mustSelectCompany) {
    return null;
  }

  return children;
}
