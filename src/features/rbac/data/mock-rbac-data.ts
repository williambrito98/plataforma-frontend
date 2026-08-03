import type { Permission, Role } from "@/features/rbac/types/rbac";

const PERMISSION_DEFINITIONS: Pick<Permission, "code" | "description">[] = [
  {
    code: "rbac.manage",
    description: "Gerenciar papéis, permissões e vínculos",
  },
  {
    code: "user.control",
    description: "Listar e gerenciar usuários do sistema",
  },
  { code: "automations.create", description: "Criar automações" },
  {
    code: "categories.read",
    description: "Listar categorias de automações",
  },
  { code: "executions.read", description: "Listar e visualizar execuções" },
  {
    code: "executions.control",
    description: "Executar, parar, reiniciar e atualizar execuções",
  },
  { code: "files.read", description: "Listar arquivos do usuário" },
  { code: "files.upload", description: "Enviar arquivos de execução" },
  { code: "files.delete", description: "Remover arquivos" },
  { code: "files.download", description: "Baixar arquivos" },
  { code: "events.stream", description: "Conectar a streams SSE" },
];

const ROLE_DEFINITIONS: {
  id: string;
  name: string;
  description: string;
  permissionCodes: string[];
}[] = [
  {
    id: "role-admin",
    name: "Admin",
    description: "Acesso total à plataforma e gestão de RBAC",
    permissionCodes: PERMISSION_DEFINITIONS.map(
      (permission) => permission.code,
    ),
  },
  {
    id: "role-cliente",
    name: "Cliente",
    description: "Acompanhar execuções, arquivos e eventos",
    permissionCodes: ["executions.read", "files.read", "events.stream"],
  },
  {
    id: "role-operador",
    name: "Operador",
    description: "Operar automações, execuções e arquivos",
    permissionCodes: [
      "automations.create",
      "categories.read",
      "executions.read",
      "executions.control",
      "files.read",
      "files.upload",
      "files.delete",
      "events.stream",
    ],
  },
];

function createInitialPermissions(): Permission[] {
  return PERMISSION_DEFINITIONS.map((permission, index) => ({
    id: `permission-${index + 1}`,
    code: permission.code,
    description: permission.description,
  }));
}

function createInitialRoles(permissions: Permission[]): Role[] {
  const permissionsByCode = new Map(
    permissions.map((permission) => [permission.code, permission]),
  );

  return ROLE_DEFINITIONS.map((role) => ({
    id: role.id,
    name: role.name,
    description: role.description,
    permissions: role.permissionCodes
      .map((code) => permissionsByCode.get(code))
      .filter((permission): permission is Permission => Boolean(permission))
      .map((permission) => ({ permission })),
  }));
}

export function createMockRbacState() {
  const permissions = createInitialPermissions();
  const roles = createInitialRoles(permissions);

  return {
    permissions,
    roles,
  };
}

export type MockRbacState = ReturnType<typeof createMockRbacState>;
