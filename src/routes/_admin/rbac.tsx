import { createFileRoute } from "@tanstack/react-router";

import { RbacPage } from "@/features/rbac/components/rbac-page";

export const Route = createFileRoute("/_admin/rbac")({
  staticData: {
    access: "rbac",
  },
  component: RbacRoutePage,
});

function RbacRoutePage() {
  return <RbacPage />;
}
