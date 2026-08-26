import { useMutation, useQueryClient } from "@tanstack/react-query";

import { alertToast } from "@/components/ui/sonner";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { createUser } from "@/features/users/api/create-user";
import { deleteUser } from "@/features/users/api/delete-user";
import {
  updateUserAdmin,
  updateUserPhoto,
} from "@/features/users/api/update-user";
import { updateUsersListCache } from "@/features/users/hooks/update-users-list-cache";
import { usersQueryKeys } from "@/features/users/hooks/users-query-keys";
import type { UpdateUserAdminPayload } from "@/features/users/types/user";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersQueryKeys.all });
      alertToast.success("Usuário criado", "Usuário criado com sucesso.");
    },
    onError: (error: unknown) => {
      alertToast.error(
        "Erro ao criar usuário",
        getErrorMessage(error, "Não foi possível criar o usuário."),
      );
    },
  });
}

export function useUpdateUserAdmin() {
  const queryClient = useQueryClient();
  const currentUserId = useAuthStore((state) => state.user?.id);

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateUserAdminPayload;
    }) => updateUserAdmin(id, payload),
    onSuccess: async (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: usersQueryKeys.all });

      if (variables.id === currentUserId) {
        await useAuthStore.getState().refreshUser();
      }

      alertToast.success(
        "Usuário atualizado",
        "Usuário atualizado com sucesso.",
      );
    },
    onError: (error: unknown) => {
      alertToast.error(
        "Erro ao atualizar usuário",
        getErrorMessage(error, "Não foi possível atualizar o usuário."),
      );
    },
  });
}

export function useUpdateUserPhoto() {
  const queryClient = useQueryClient();
  const currentUserId = useAuthStore((state) => state.user?.id);

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      updateUserPhoto(id, file),
    onSuccess: async (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: usersQueryKeys.all });

      if (variables.id === currentUserId) {
        await useAuthStore.getState().refreshUser();
      }

      alertToast.success("Foto atualizada", "Foto do usuário atualizada.");
    },
    onError: (error: unknown) => {
      alertToast.error(
        "Erro ao atualizar foto",
        getErrorMessage(error, "Não foi possível atualizar a foto."),
      );
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (_data, userId) => {
      updateUsersListCache(queryClient, (users) =>
        users.filter((user) => user.id !== userId),
      );
      queryClient.invalidateQueries({ queryKey: usersQueryKeys.all });
      alertToast.success("Usuário removido", "Usuário removido com sucesso.");
    },
    onError: (error: unknown) => {
      alertToast.error(
        "Erro ao remover usuário",
        getErrorMessage(error, "Não foi possível remover o usuário."),
      );
    },
  });
}
