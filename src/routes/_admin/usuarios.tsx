import { createFileRoute } from "@tanstack/react-router";

import { PermissionCodes } from "@/features/auth/constants/permissions";
import { UsersPage } from "@/features/users/components/users-page";

export const Route = createFileRoute("/_admin/usuarios")({
  staticData: {
    access: { permissions: [PermissionCodes.USER_CONTROL] },
  },
  component: UsuariosRoutePage,
});

function UsuariosRoutePage() {
  return <UsersPage />;
}
