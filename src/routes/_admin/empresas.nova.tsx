import { createFileRoute } from "@tanstack/react-router";

import { PermissionCodes } from "@/features/auth/constants/permissions";
import { CreateCompanyPage } from "@/features/companies/components/create-company-page";

export const Route = createFileRoute("/_admin/empresas/nova")({
  staticData: {
    access: { permissions: [PermissionCodes.COMPANIES_CREATE] },
  },
  component: NovaEmpresaPage,
});

function NovaEmpresaPage() {
  return <CreateCompanyPage />;
}
