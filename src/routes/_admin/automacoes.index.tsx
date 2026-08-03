import { createFileRoute } from "@tanstack/react-router";

import { AutomationsListPage } from "@/features/automations/components/automations-list-page";
import { PermissionCodes } from "@/features/auth/constants/permissions";

export const Route = createFileRoute("/_admin/automacoes/")({
  staticData: {
    access: { permissions: [PermissionCodes.EXECUTIONS_READ] },
  },
  component: AutomacoesIndexPage,
});

function AutomacoesIndexPage() {
  return <AutomationsListPage />;
}
