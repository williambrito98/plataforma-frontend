import { createFileRoute } from "@tanstack/react-router";

import { PermissionCodes } from "@/features/auth/constants/permissions";
import { EditCompanyPage } from "@/features/companies/components/edit-company-page";

export const Route = createFileRoute("/_admin/empresas/$id/editar")({
  staticData: {
    access: { permissions: [PermissionCodes.COMPANIES_UPDATE] },
  },
  component: EditarEmpresaPage,
});

function EditarEmpresaPage() {
  const { id } = Route.useParams();
  return <EditCompanyPage companyId={id} />;
}
