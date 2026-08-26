import { createFileRoute } from "@tanstack/react-router";

import { EditAutomationPage } from "@/features/automations/components/edit-automation-page";
import { PermissionCodes } from "@/features/auth/constants/permissions";

export const Route = createFileRoute("/_admin/automacoes/$id/editar")({
  staticData: {
    access: { permissions: [PermissionCodes.AUTOMATIONS_UPDATE] },
  },
  component: EditarAutomacaoPage,
});

function EditarAutomacaoPage() {
  const { id } = Route.useParams();
  return <EditAutomationPage automationId={id} />;
}
