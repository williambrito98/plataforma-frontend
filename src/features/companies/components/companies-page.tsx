import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { alertToast } from "@/components/ui/sonner";
import { PermissionCodes } from "@/features/auth/constants/permissions";
import { useCan } from "@/features/auth/hooks/use-can";
import { CompaniesTable } from "@/features/companies/components/companies-table";
import { useCompanies } from "@/features/companies/hooks/use-companies";

export function CompaniesPage() {
  const canCreate = useCan(PermissionCodes.COMPANIES_CREATE);
  const { data: companies = [], isLoading, isError, error } = useCompanies();

  useEffect(() => {
    if (isError) {
      alertToast.error(
        "Erro ao carregar empresas",
        error instanceof Error ? error.message : undefined,
      );
    }
  }, [isError, error]);

  return (
    <div className="flex flex-col gap-6">
      {canCreate ? (
        <div className="flex items-center justify-end">
          <Button render={<Link to="/empresas/nova" />} nativeButton={false}>
            <Plus aria-hidden />
            Cadastrar empresa
          </Button>
        </div>
      ) : null}
      <CompaniesTable companies={companies} isLoading={isLoading} />
    </div>
  );
}
