import { useEffect } from "react";

import { alertToast } from "@/components/ui/sonner";
import { CreateUserForm } from "@/features/users/components/create-user-form";
import { UsersTable } from "@/features/users/components/users-table";
import { useUsers } from "@/features/users/hooks/use-users";

export function UsersPage() {
  const { data: users = [], isLoading, isError, error } = useUsers();

  useEffect(() => {
    if (isError) {
      alertToast.error(
        "Erro ao carregar usuários",
        error instanceof Error ? error.message : undefined,
      );
    }
  }, [isError, error]);

  return (
    <div className="flex flex-col gap-6">
      <CreateUserForm />
      <UsersTable users={users} isLoading={isLoading} />
    </div>
  );
}
