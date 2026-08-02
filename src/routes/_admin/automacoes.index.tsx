import { createFileRoute } from "@tanstack/react-router";

import { AutomationsListPage } from "@/features/automations/components/automations-list-page";

export const Route = createFileRoute("/_admin/automacoes/")({
  component: AutomacoesIndexPage,
});

function AutomacoesIndexPage() {
  return <AutomationsListPage />;
}
