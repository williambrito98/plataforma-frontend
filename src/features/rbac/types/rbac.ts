export interface Permission {
  id: string;
  code: string;
  description?: string | null;
}

export interface RolePermissionLink {
  permission: Permission;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions?: RolePermissionLink[];
}

export interface SetRolePermissionsPayload {
  permissionIds: string[];
}

export interface SetUserRolePayload {
  roleId?: string | null;
}

export type PermissionApiResponse = {
  id: string;
  code: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type RolePermissionLinkApiResponse = {
  permission: PermissionApiResponse;
};

export type RoleApiResponse = {
  id: string;
  name: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
  permissions?: RolePermissionLinkApiResponse[];
};

export function normalizePermission(
  permission: PermissionApiResponse,
): Permission {
  return {
    id: permission.id,
    code: permission.code,
    description: permission.description ?? null,
  };
}

export function normalizeRole(role: RoleApiResponse): Role {
  return {
    id: role.id,
    name: role.name,
    description: role.description ?? null,
    permissions: role.permissions?.map((item) => ({
      permission: normalizePermission(item.permission),
    })),
  };
}
