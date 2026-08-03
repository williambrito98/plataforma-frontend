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
