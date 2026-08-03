import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AdminPagePlaceholder } from "@/features/admin/components/admin-page-placeholder";
import { PermissionCodes } from "@/features/auth/constants/permissions";
import { useCan } from "@/features/auth/hooks/use-can";

export function AutomationsListPage() {
  const canCreate = useCan(PermissionCodes.AUTOMATIONS_CREATE);

  return (
    <div className="flex flex-col gap-6">
      {canCreate ? (
        <div className="flex items-center justify-end">
          <Button render={<Link to="/automacoes/nova" />} nativeButton={false}>
            <Plus aria-hidden />
            Criar automação
          </Button>
        </div>
      ) : null}
      <AdminPagePlaceholder title="Automações" />
    </div>
  );
}
