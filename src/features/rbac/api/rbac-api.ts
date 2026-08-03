import { createMockRbacState } from "@/features/rbac/data/mock-rbac-data";
import type {
  Permission,
  Role,
  SetRolePermissionsPayload,
  SetUserRolePayload,
} from "@/features/rbac/types/rbac";

const MOCK_DELAY_MS = 400;

const mockState = createMockRbacState();
let nextPermissionId = mockState.permissions.length + 1;
let nextRoleId = mockState.roles.length + 1;

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function clonePermissions() {
  return mockState.permissions.map((permission) => ({ ...permission }));
}

function cloneRoles() {
  return mockState.roles.map((role) => ({
    ...role,
    permissions: role.permissions?.map((item) => ({
      permission: { ...item.permission },
    })),
  }));
}

function findPermissionById(permissionId: string) {
  return mockState.permissions.find(
    (permission) => permission.id === permissionId,
  );
}

function findRoleById(roleId: string) {
  return mockState.roles.find((role) => role.id === roleId);
}

export async function listPermissions(): Promise<Permission[]> {
  await delay(MOCK_DELAY_MS);
  return clonePermissions();
}

export async function createPermission(payload: {
  code: string;
  description?: string;
}): Promise<Permission> {
  await delay(MOCK_DELAY_MS);

  const permission: Permission = {
    id: `permission-${nextPermissionId++}`,
    code: payload.code,
    description: payload.description ?? null,
  };

  mockState.permissions.push(permission);
  return { ...permission };
}

export async function listRoles(): Promise<Role[]> {
  await delay(MOCK_DELAY_MS);
  return cloneRoles();
}

export async function createRole(payload: {
  name: string;
  description?: string;
}): Promise<Role> {
  await delay(MOCK_DELAY_MS);

  const role: Role = {
    id: `role-${nextRoleId++}`,
    name: payload.name,
    description: payload.description ?? null,
    permissions: [],
  };

  mockState.roles.push(role);
  return {
    ...role,
    permissions: [],
  };
}

export async function setRolePermissions(
  roleId: string,
  payload: SetRolePermissionsPayload,
): Promise<Role> {
  await delay(MOCK_DELAY_MS);

  const role = findRoleById(roleId);

  if (!role) {
    throw new Error("Papel não encontrado.");
  }

  role.permissions = payload.permissionIds
    .map((permissionId) => findPermissionById(permissionId))
    .filter((permission): permission is Permission => Boolean(permission))
    .map((permission) => ({ permission }));

  return {
    ...role,
    permissions: role.permissions.map((item) => ({
      permission: { ...item.permission },
    })),
  };
}

export async function setUserRole(
  userId: string,
  payload: SetUserRolePayload,
): Promise<{ userId: string; roleId: string | null }> {
  await delay(MOCK_DELAY_MS);

  if (!userId.trim()) {
    throw new Error("User ID obrigatório.");
  }

  if (payload.roleId && !findRoleById(payload.roleId)) {
    throw new Error("Papel não encontrado.");
  }

  return {
    userId,
    roleId: payload.roleId ?? null,
  };
}
