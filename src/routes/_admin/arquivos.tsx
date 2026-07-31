import { createFileRoute } from "@tanstack/react-router";

import { FilesPage } from "@/features/files/components/files-page";

export const Route = createFileRoute("/_admin/arquivos")({
  component: ArquivosPage,
});

function ArquivosPage() {
  return <FilesPage />;
}
