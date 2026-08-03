import { createFileRoute } from "@tanstack/react-router";

import { FilesPage } from "@/features/files/components/files-page";
import { PermissionCodes } from "@/features/auth/constants/permissions";

export const Route = createFileRoute("/_admin/arquivos")({
  staticData: {
    access: { permissions: [PermissionCodes.FILES_READ] },
  },
  component: ArquivosPage,
});

function ArquivosPage() {
  return <FilesPage />;
}
