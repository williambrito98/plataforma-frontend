import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AdminPagePlaceholder } from "@/features/admin/components/admin-page-placeholder";

export function AutomationsListPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-end">
        <Button render={<Link to="/automacoes/nova" />} nativeButton={false}>
          <Plus aria-hidden />
          Criar automação
        </Button>
      </div>
      <AdminPagePlaceholder title="Automações" />
    </div>
  );
}
