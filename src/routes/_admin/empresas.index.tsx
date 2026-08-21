import { createFileRoute } from "@tanstack/react-router";

import { PermissionCodes } from "@/features/auth/constants/permissions";
import { CompaniesPage } from "@/features/companies/components/companies-page";

export const Route = createFileRoute("/_admin/empresas/")({
  staticData: {
    access: { permissions: [PermissionCodes.COMPANIES_READ] },
  },
  component: EmpresasIndexPage,
});

function EmpresasIndexPage() {
  return <CompaniesPage />;
}
