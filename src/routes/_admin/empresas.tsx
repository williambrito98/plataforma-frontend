import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin/empresas")({
  component: EmpresasLayout,
});

function EmpresasLayout() {
  return <Outlet />;
}
