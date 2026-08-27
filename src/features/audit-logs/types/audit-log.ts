export type AuditAction = "CREATE" | "UPDATE" | "DELETE";

export type AuditLogUserSummary = {
  id: string;
  name: string;
  email: string;
};

export type AuditLogCompanySummary = {
  id: string;
  name: string;
};

export type AuditDiffEntry = {
  from: unknown;
  to: unknown;
};

export type AuditChanges =
  | { after: unknown }
  | {
      before: unknown;
      after: unknown;
      diff: Record<string, AuditDiffEntry> | null;
    }
  | { before: unknown };

export type AuditLogApiResponse = {
  id: string;
  action: AuditAction;
  entityType: string;
  entityId?: string | null;
  changes?: AuditChanges | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  user?: AuditLogUserSummary | null;
  company?: AuditLogCompanySummary | null;
};

export type AuditLogItem = {
  id: string;
  action: AuditAction;
  entityType: string;
  entityId: string | null;
  changes: AuditChanges | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  user: AuditLogUserSummary | null;
  company: AuditLogCompanySummary | null;
};

export function normalizeAuditLog(item: AuditLogApiResponse): AuditLogItem {
  return {
    id: item.id,
    action: item.action,
    entityType: item.entityType,
    entityId: item.entityId ?? null,
    changes: (item.changes as AuditChanges | null | undefined) ?? null,
    metadata: item.metadata ?? null,
    createdAt: item.createdAt,
    user: item.user ?? null,
    company: item.company ?? null,
  };
}

export const AUDIT_ACTION_OPTIONS: {
  value: AuditAction | "ALL";
  label: string;
}[] = [
  { value: "ALL", label: "Todas as ações" },
  { value: "CREATE", label: "Criação" },
  { value: "UPDATE", label: "Atualização" },
  { value: "DELETE", label: "Exclusão" },
];

export const AUDIT_ENTITY_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "ALL", label: "Todas as entidades" },
  { value: "user", label: "Usuário" },
  { value: "company", label: "Empresa" },
  { value: "category", label: "Categoria" },
  { value: "automation", label: "Automação" },
  { value: "execution", label: "Execução" },
  { value: "execution_file", label: "Arquivo de execução" },
  { value: "role", label: "Papel" },
  { value: "permission", label: "Permissão" },
  { value: "role_permission", label: "Permissões do papel" },
  { value: "user_role", label: "Papel do usuário" },
  { value: "user_company", label: "Membro da empresa" },
];
