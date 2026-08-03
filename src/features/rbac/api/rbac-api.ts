import { getApiErrorMessage } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

import type {
  Permission,
  PermissionApiResponse,
  Role,
  RoleApiResponse,
  SetRolePermissionsPayload,
  SetUserRolePayload,
} from "@/features/rbac/types/rbac";
import { normalizePermission, normalizeRole } from "@/features/rbac/types/rbac";

export async function listPermissions(): Promise<Permission[]> {
  try {
    const { data } = await apiClient.get<PermissionApiResponse[]>(
      "/admin/rbac/permissions",
    );
    return data.map(normalizePermission);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível carregar as permissões."),
      { cause: error },
    );
  }
}

export async function createPermission(payload: {
  code: string;
  description?: string;
}): Promise<Permission> {
  try {
    const { data } = await apiClient.post<PermissionApiResponse>(
      "/admin/rbac/permissions",
      payload,
    );
    return normalizePermission(data);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível criar a permissão."),
      { cause: error },
    );
  }
}

export async function listRoles(): Promise<Role[]> {
  try {
    const { data } =
      await apiClient.get<RoleApiResponse[]>("/admin/rbac/roles");
    return data.map(normalizeRole);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível carregar os papéis."),
      { cause: error },
    );
  }
}

export async function createRole(payload: {
  name: string;
  description?: string;
}): Promise<Role> {
  try {
    const { data } = await apiClient.post<RoleApiResponse>(
      "/admin/rbac/roles",
      payload,
    );
    return normalizeRole(data);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível criar o papel."),
      { cause: error },
    );
  }
}

export async function setRolePermissions(
  roleId: string,
  payload: SetRolePermissionsPayload,
): Promise<Role> {
  try {
    const { data } = await apiClient.put<RoleApiResponse>(
      `/admin/rbac/roles/${roleId}/permissions`,
      payload,
    );
    return normalizeRole(data);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível atualizar as permissões."),
      { cause: error },
    );
  }
}

export async function setUserRole(
  userId: string,
  payload: SetUserRolePayload,
): Promise<{ userId: string; roleId: string | null }> {
  try {
    await apiClient.put(`/admin/rbac/users/${userId}/roles`, payload);
    return {
      userId,
      roleId: payload.roleId ?? null,
    };
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
        "Não foi possível atualizar o papel do usuário.",
      ),
      { cause: error },
    );
  }
}
