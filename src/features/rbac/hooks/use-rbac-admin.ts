import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { alertToast } from "@/components/ui/sonner";
import {
  createPermission,
  createRole,
  listPermissions,
  listRoles,
  setRolePermissions,
  setUserRole,
} from "@/features/rbac/api/rbac-api";
import { rbacQueryKeys } from "@/features/rbac/hooks/rbac-query-keys";
import { authQueryKeys } from "@/features/auth/hooks/auth-query-keys";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function useRbacPermissions() {
  return useQuery({
    queryKey: rbacQueryKeys.permissions,
    queryFn: listPermissions,
  });
}

export function useRbacRoles() {
  return useQuery({
    queryKey: rbacQueryKeys.roles,
    queryFn: listRoles,
  });
}

export function useCreatePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rbacQueryKeys.permissions });
      alertToast.success("Permissão criada", "Permissão criada com sucesso.");
    },
    onError: (error: unknown) => {
      alertToast.error(
        "Erro ao criar permissão",
        getErrorMessage(error, "Não foi possível criar a permissão."),
      );
    },
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rbacQueryKeys.roles });
      alertToast.success("Papel criado", "Papel criado com sucesso.");
    },
    onError: (error: unknown) => {
      alertToast.error(
        "Erro ao criar papel",
        getErrorMessage(error, "Não foi possível criar o papel."),
      );
    },
  });
}

export function useSetRolePermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roleId,
      permissionIds,
    }: {
      roleId: string;
      permissionIds: string[];
    }) => setRolePermissions(roleId, { permissionIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rbacQueryKeys.roles });
      queryClient.invalidateQueries({ queryKey: authQueryKeys.session });
      alertToast.success(
        "Permissões atualizadas",
        "Permissões do papel atualizadas.",
      );
    },
    onError: (error: unknown) => {
      alertToast.error(
        "Erro ao atualizar permissões",
        getErrorMessage(error, "Não foi possível atualizar as permissões."),
      );
    },
  });
}

export function useSetUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      roleId,
    }: {
      userId: string;
      roleId?: string | null;
    }) => setUserRole(userId, { roleId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authQueryKeys.session });
      queryClient.invalidateQueries({ queryKey: rbacQueryKeys.roles });
      alertToast.success(
        "Papel atualizado",
        "Papel do usuário atualizado com sucesso.",
      );
    },
    onError: (error: unknown) => {
      alertToast.error(
        "Erro ao atualizar papel",
        getErrorMessage(
          error,
          "Não foi possível atualizar o papel do usuário.",
        ),
      );
    },
  });
}
