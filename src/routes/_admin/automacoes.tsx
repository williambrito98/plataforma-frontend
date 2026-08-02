import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin/automacoes")({
  component: AutomacoesLayout,
});

function AutomacoesLayout() {
  return <Outlet />;
}
