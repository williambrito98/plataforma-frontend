import { createFileRoute } from "@tanstack/react-router";

import { PasswordRecoveryPage } from "@/features/auth/components/password-recovery-page";

export const Route = createFileRoute("/recuperar-senha")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PasswordRecoveryPage />;
}
