import { createFileRoute } from "@tanstack/react-router";

import { AdminPagePlaceholder } from "@/features/admin/components/admin-page-placeholder";

export const Route = createFileRoute("/_admin/automacoes")({
  component: AutomacoesPage,
});

function AutomacoesPage() {
  return <AdminPagePlaceholder title="Automações" />;
}
