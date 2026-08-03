import { createFileRoute } from "@tanstack/react-router";

import { CreateAutomationPage } from "@/features/automations/components/create-automation-page";
import { PermissionCodes } from "@/features/auth/constants/permissions";

export const Route = createFileRoute("/_admin/automacoes/nova")({
  staticData: {
    access: { permissions: [PermissionCodes.AUTOMATIONS_CREATE] },
  },
  component: NovaAutomacaoPage,
});

function NovaAutomacaoPage() {
  return <CreateAutomationPage />;
}
