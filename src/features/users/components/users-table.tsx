import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession } from "@/features/auth/hooks/use-session";
import { formatFileDate } from "@/features/files/utils/format-file-date";
import { DeleteUserDialog } from "@/features/users/components/delete-user-dialog";
import { EditUserSheet } from "@/features/users/components/edit-user-sheet";
import { useDeleteUser } from "@/features/users/hooks/use-users-admin";
import type { UserListItem } from "@/features/users/types/user";

type UsersTableProps = {
  users: UserListItem[];
  isLoading: boolean;
};

type UserToDelete = {
  id: string;
  name: string;
};

function getUserInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function UsersTable({ users, isLoading }: UsersTableProps) {
  const { user: currentUser } = useSession();
  const deleteUser = useDeleteUser();

  const [editingUser, setEditingUser] = useState<UserListItem | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserToDelete | null>(null);

  async function handleConfirmDelete() {
    if (!userToDelete) {
      return;
    }

    try {
      await deleteUser.mutateAsync(userToDelete.id);
      setUserToDelete(null);
    } catch {
      // Erro tratado pelo hook via toast.
    }
  }

  return (
    <>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-foreground">
            Usuários cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-14" />
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Papel</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-muted-foreground">
                    Carregando usuários...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-muted-foreground">
                    Nenhum usuário encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => {
                  const isCurrentUser = user.id === currentUser?.id;

                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Avatar className="size-8 rounded-md after:rounded-md">
                          {user.profilePhotoUrl ? (
                            <AvatarImage
                              src={user.profilePhotoUrl}
                              alt={user.name}
                              className="rounded-md object-cover"
                            />
                          ) : null}
                          <AvatarFallback className="rounded-md bg-muted text-xs">
                            {getUserInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="text-foreground">
                        {user.name}
                        {isCurrentUser ? (
                          <span className="ml-2 text-xs text-muted-foreground">
                            (você)
                          </span>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.role?.name ?? "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.createdAt ? formatFileDate(user.createdAt) : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Editar ${user.name}`}
                            onClick={() => setEditingUser(user)}
                          >
                            <Pencil aria-hidden />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Excluir ${user.name}`}
                            disabled={isCurrentUser}
                            title={
                              isCurrentUser
                                ? "Você não pode remover sua própria conta"
                                : undefined
                            }
                            className="text-destructive hover:text-destructive"
                            onClick={() =>
                              setUserToDelete({
                                id: user.id,
                                name: user.name,
                              })
                            }
                          >
                            <Trash2 aria-hidden />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EditUserSheet
        user={editingUser}
        open={editingUser !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingUser(null);
          }
        }}
      />

      <DeleteUserDialog
        userName={userToDelete?.name ?? null}
        open={userToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deleteUser.isPending) {
            setUserToDelete(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        isPending={deleteUser.isPending}
      />
    </>
  );
}
