import { useEffect } from "react";

import { alertToast } from "@/components/ui/sonner";
import { CreateRoleForm } from "@/features/rbac/components/create-role-form";
import {
  RolePermissionsEditor,
  RolesTable,
} from "@/features/rbac/components/roles-table";
import {
  useRbacPermissions,
  useRbacRoles,
} from "@/features/rbac/hooks/use-rbac-admin";

export function RbacRolesTab() {
  const {
    data: permissions = [],
    isError: isPermissionsError,
    error: permissionsError,
  } = useRbacPermissions();
  const { data: roles = [], isLoading, isError, error } = useRbacRoles();

  useEffect(() => {
    if (isPermissionsError) {
      alertToast.error(
        "Erro ao carregar permissões",
        permissionsError instanceof Error
          ? permissionsError.message
          : undefined,
      );
    }
  }, [isPermissionsError, permissionsError]);

  useEffect(() => {
    if (isError) {
      alertToast.error(
        "Erro ao carregar papéis",
        error instanceof Error ? error.message : undefined,
      );
    }
  }, [isError, error]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-5">
        <div className="md:col-span-3">
          <CreateRoleForm />
        </div>
        <div className="md:col-span-2">
          <RolePermissionsEditor roles={roles} permissions={permissions} />
        </div>
      </div>
      <RolesTable roles={roles} isLoading={isLoading} />
    </div>
  );
}
