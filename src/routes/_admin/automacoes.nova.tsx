import { createFileRoute } from "@tanstack/react-router";

import { CreateAutomationPage } from "@/features/automations/components/create-automation-page";

export const Route = createFileRoute("/_admin/automacoes/nova")({
  component: NovaAutomacaoPage,
});

function NovaAutomacaoPage() {
  return <CreateAutomationPage />;
}
