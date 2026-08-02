import { createFileRoute } from "@tanstack/react-router";

import { AdjustPage } from "@/features/adjust/components/adjust-page";

export const Route = createFileRoute("/_admin/ajustes")({
  component: AjustesPage,
});

function AjustesPage() {
  return <AdjustPage />;
}
