import { createFileRoute } from "@tanstack/react-router";

import { AdminLayout } from "@/features/admin/components/admin-layout";

export const Route = createFileRoute("/_admin")({
  component: AdminLayout,
});
