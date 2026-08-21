import { createFileRoute } from "@tanstack/react-router";

import { PermissionCodes } from "@/features/auth/constants/permissions";
import { CompaniesPage } from "@/features/companies/components/companies-page";

export const Route = createFileRoute("/_admin/empresas")({
  staticData: {
    access: { permissions: [PermissionCodes.COMPANIES_CREATE] },
  },
  component: EmpresasRoutePage,
});

function EmpresasRoutePage() {
  return <CompaniesPage />;
}
