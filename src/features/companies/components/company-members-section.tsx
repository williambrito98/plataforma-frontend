import { useEffect, useMemo, useState } from "react";
import { Trash2, Users } from "lucide-react";

import { AppModal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { alertToast } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PermissionCodes } from "@/features/auth/constants/permissions";
import { useCan } from "@/features/auth/hooks/use-can";
import {
  useAddCompanyMember,
  useCompanyMembers,
  useRemoveCompanyMember,
} from "@/features/companies/hooks/use-company-members";
import { useUsers } from "@/features/users/hooks/use-users";

type CompanyMembersSectionProps = {
  companyId: string;
};

type MemberToRemove = {
  id: string;
  name: string;
};

export function CompanyMembersSection({
  companyId,
}: CompanyMembersSectionProps) {
  const canManageMembers = useCan(PermissionCodes.COMPANIES_MANAGE_MEMBERS);
  const canListUsers = useCan(PermissionCodes.USER_CONTROL);

  const {
    data: members = [],
    isLoading: isMembersLoading,
    isError: isMembersError,
    error: membersError,
  } = useCompanyMembers(companyId);

  const {
    data: users = [],
    isLoading: isUsersLoading,
    isError: isUsersError,
    error: usersError,
  } = useUsers({ enabled: canManageMembers && canListUsers });

  const addMember = useAddCompanyMember(companyId);
  const removeMember = useRemoveCompanyMember(companyId);

  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [memberToRemove, setMemberToRemove] = useState<MemberToRemove | null>(
    null,
  );

  const availableUsers = useMemo(() => {
    const memberIds = new Set(members.map((member) => member.id));
    return users.filter((user) => !memberIds.has(user.id));
  }, [members, users]);

  useEffect(() => {
    if (isMembersError) {
      alertToast.error(
        "Erro ao carregar membros",
        membersError instanceof Error ? membersError.message : undefined,
      );
    }
  }, [isMembersError, membersError]);

  useEffect(() => {
    if (isUsersError && canManageMembers && canListUsers) {
      alertToast.error(
        "Erro ao carregar usuários",
        usersError instanceof Error ? usersError.message : undefined,
      );
    }
  }, [isUsersError, usersError, canManageMembers, canListUsers]);

  useEffect(() => {
    if (
      selectedUserId &&
      !availableUsers.some((user) => user.id === selectedUserId)
    ) {
      setSelectedUserId("");
    }
  }, [availableUsers, selectedUserId]);

  if (!canManageMembers) {
    return null;
  }

  async function handleAddMember() {
    if (!selectedUserId) {
      return;
    }

    try {
      await addMember.mutateAsync(selectedUserId);
      setSelectedUserId("");
    } catch {
      // Erro tratado pelo hook via toast.
    }
  }

  async function handleConfirmRemove() {
    if (!memberToRemove) {
      return;
    }

    try {
      await removeMember.mutateAsync(memberToRemove.id);
      setMemberToRemove(null);
    } catch {
      // Erro tratado pelo hook via toast.
    }
  }

  return (
    <>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-foreground">
            <Users className="size-5" aria-hidden />
            Usuários vinculados
          </CardTitle>
          <CardDescription>
            Gerencie os usuários que têm acesso a esta empresa.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {canListUsers ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <div className="flex-1">
                <Select
                  value={selectedUserId}
                  onValueChange={(value) => setSelectedUserId(value ?? "")}
                  disabled={isUsersLoading || addMember.isPending}
                >
                  <SelectTrigger className="h-8 w-full shadow-none">
                    <SelectValue placeholder="Selecione um usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                onClick={handleAddMember}
                disabled={!selectedUserId || addMember.isPending}
                loading={addMember.isPending}
              >
                Vincular usuário
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Você não tem permissão para listar usuários do sistema. Apenas a
              listagem de membros vinculados está disponível.
            </p>
          )}

          {isMembersLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton
                  key={`member-skeleton-${index}`}
                  className="h-10 w-full"
                />
              ))}
            </div>
          ) : members.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum usuário vinculado a esta empresa.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  {canListUsers ? (
                    <TableHead className="text-right">Ações</TableHead>
                  ) : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="text-foreground">
                      {member.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {member.email}
                    </TableCell>
                    {canListUsers ? (
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Desvincular ${member.name}`}
                          className="text-destructive hover:text-destructive"
                          onClick={() =>
                            setMemberToRemove({
                              id: member.id,
                              name: member.name,
                            })
                          }
                        >
                          <Trash2 aria-hidden />
                        </Button>
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AppModal
        variant="confirmation"
        open={memberToRemove !== null}
        onOpenChange={(open) => {
          if (!open && !removeMember.isPending) {
            setMemberToRemove(null);
          }
        }}
        title="Desvincular usuário"
        description={
          <>
            Tem certeza que deseja desvincular{" "}
            <span className="font-medium text-foreground">
              {memberToRemove?.name}
            </span>{" "}
            desta empresa?
          </>
        }
        cancelLabel="Cancelar"
        confirmLabel="Desvincular"
        onConfirm={handleConfirmRemove}
        loading={removeMember.isPending}
      />
    </>
  );
}
