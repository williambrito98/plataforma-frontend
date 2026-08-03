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
  const { data: permissions = [] } = useRbacPermissions();
  const { data: roles = [], isLoading } = useRbacRoles();

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
