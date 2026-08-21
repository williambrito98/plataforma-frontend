import { useAuthUser } from "@/features/auth/stores/auth-store";
import {
  findCompanyById,
  useSelectedCompanyId,
} from "@/features/companies/stores/company-store";
import { getUserCompanies } from "@/features/companies/lib/company-selection";

export function useSelectedCompany() {
  const user = useAuthUser();
  const selectedCompanyId = useSelectedCompanyId();
  const companies = getUserCompanies(user);
  const selectedCompany = findCompanyById(companies, selectedCompanyId);

  return {
    companies,
    selectedCompanyId,
    selectedCompany,
    hasMultipleCompanies: companies.length > 1,
  };
}
