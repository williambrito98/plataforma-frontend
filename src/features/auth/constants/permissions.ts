/**
 * Códigos estáveis de permissão (espelham o backend).
 * Novas permissões: cadastrar no backend e referenciar aqui ao proteger rotas.
 */
export const PermissionCodes = {
  RBAC_MANAGE: "rbac.manage",

  USER_CONTROL: "user.control",

  COMPANIES_READ: "companies.read",
  COMPANIES_CREATE: "companies.create",
  COMPANIES_UPDATE: "companies.update",
  COMPANIES_MANAGE_MEMBERS: "companies.manage_members",

  AUTOMATIONS_CREATE: "automations.create",

  CATEGORIES_READ: "categories.read",
  CATEGORIES_CREATE: "categories.create",
  CATEGORIES_UPDATE: "categories.update",
  CATEGORIES_DELETE: "categories.delete",

  EXECUTIONS_READ: "executions.read",
  EXECUTIONS_CONTROL: "executions.control",
  EXECUTIONS_FINISH: "executions.finish",

  FILES_READ: "files.read",
  FILES_UPLOAD: "files.upload",
  FILES_DELETE: "files.delete",
  FILES_READ_BY_EXECUTION: "files.read_by_execution",
  FILES_DOWNLOAD: "files.download",

  EVENTS_STREAM: "events.stream",
} as const;

export type PermissionCode =
  (typeof PermissionCodes)[keyof typeof PermissionCodes];

export const ADMIN_ROLE = "Admin";
