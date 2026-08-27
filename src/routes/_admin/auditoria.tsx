import { createFileRoute } from "@tanstack/react-router";

import { AuditLogsPage } from "@/features/audit-logs/components/audit-logs-page";
import { PermissionCodes } from "@/features/auth/constants/permissions";

export const Route = createFileRoute("/_admin/auditoria")({
  staticData: {
    access: { permissions: [PermissionCodes.AUDIT_LOGS_READ] },
  },
  component: () => <AuditLogsPage />,
});
