import { createFileRoute } from "@tanstack/react-router";

import { AdminPagePlaceholder } from "@/features/admin/components/admin-page-placeholder";

export const Route = createFileRoute("/_admin/ajustes")({
  component: AjustesPage,
});

function AjustesPage() {
  return <AdminPagePlaceholder title="Ajustes" />;
}
