import { useMutation } from "@tanstack/react-query";

import { alertToast } from "@/components/ui/sonner";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { updateUser, updateUserPhoto } from "@/features/users/api/update-user";

type UpdateProfileInput = {
  userId: string;
  name?: string;
  password?: string;
  photo?: File;
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function useUpdateProfile() {
  const refreshUser = useAuthStore((state) => state.refreshUser);

  return useMutation({
    mutationFn: async ({
      userId,
      name,
      password,
      photo,
    }: UpdateProfileInput) => {
      if (photo) {
        return updateUserPhoto(userId, photo);
      }

      return updateUser(userId, {
        ...(name !== undefined ? { name } : {}),
        ...(password ? { password } : {}),
      });
    },
    onSuccess: async (_data, variables) => {
      await refreshUser();

      if (variables.photo) {
        alertToast.success(
          "Foto atualizada",
          "Sua foto de perfil foi alterada.",
        );
        return;
      }

      alertToast.success("Perfil atualizado", "Suas alterações foram salvas.");
    },
    onError: (error: unknown, variables) => {
      if (variables.photo) {
        alertToast.error(
          "Erro ao atualizar foto",
          getErrorMessage(error, "Não foi possível atualizar a foto."),
        );
        return;
      }

      alertToast.error(
        "Erro ao salvar perfil",
        getErrorMessage(error, "Não foi possível salvar as alterações."),
      );
    },
  });
}
