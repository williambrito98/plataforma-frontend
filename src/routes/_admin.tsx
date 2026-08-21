import { createFileRoute } from "@tanstack/react-router";

import { AdminLayout } from "@/features/admin/components/admin-layout";
import { RequireCompanySelection } from "@/features/companies/components/require-company-selection";

export const Route = createFileRoute("/_admin")({
  component: AdminRouteLayout,
});

function AdminRouteLayout() {
  return (
    <RequireCompanySelection>
      <AdminLayout />
    </RequireCompanySelection>
  );
}
