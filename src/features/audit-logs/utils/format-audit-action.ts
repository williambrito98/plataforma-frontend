import type { AuditAction } from "@/features/audit-logs/types/audit-log";

const ACTION_LABELS: Record<AuditAction, string> = {
  CREATE: "Criação",
  UPDATE: "Atualização",
  DELETE: "Exclusão",
};

export function formatAuditAction(action: AuditAction): string {
  return ACTION_LABELS[action];
}

const ENTITY_TYPE_LABELS: Record<string, string> = {
  user: "Usuário",
  company: "Empresa",
  category: "Categoria",
  automation: "Automação",
  execution: "Execução",
  execution_file: "Arquivo de execução",
  role: "Papel",
  permission: "Permissão",
  role_permission: "Permissões do papel",
  user_role: "Papel do usuário",
  user_company: "Membro da empresa",
};

export function formatAuditEntityType(entityType: string): string {
  return ENTITY_TYPE_LABELS[entityType] ?? entityType;
}

export function formatAuditValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "—";
  }

  if (typeof value === "string") {
    return value;
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}
