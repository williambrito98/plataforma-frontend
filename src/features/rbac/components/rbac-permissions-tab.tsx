import { CreatePermissionForm } from "@/features/rbac/components/create-permission-form";
import { PermissionsTable } from "@/features/rbac/components/permissions-table";
import { useRbacPermissions } from "@/features/rbac/hooks/use-rbac-admin";

export function RbacPermissionsTab() {
  const { data: permissions = [], isLoading } = useRbacPermissions();

  return (
    <div className="space-y-6">
      <CreatePermissionForm />
      <PermissionsTable permissions={permissions} isLoading={isLoading} />
    </div>
  );
}
