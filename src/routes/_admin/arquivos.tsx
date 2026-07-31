import { createFileRoute } from "@tanstack/react-router";

import { AdminPagePlaceholder } from "@/features/admin/components/admin-page-placeholder";

export const Route = createFileRoute("/_admin/arquivos")({
  component: ArquivosPage,
});

function ArquivosPage() {
  return <AdminPagePlaceholder title="Arquivos" />;
}
