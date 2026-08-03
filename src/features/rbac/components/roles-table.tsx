import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { Permission, Role } from "@/features/rbac/types/rbac";
import { useSetRolePermissions } from "@/features/rbac/hooks/use-rbac-admin";
import { cn } from "@/lib/utils";

const SKELETON_ROW_COUNT = 5;

type RolePermissionsEditorProps = {
  roles: Role[];
  permissions: Permission[];
};

export function RolePermissionsEditor({
  roles,
  permissions,
}: RolePermissionsEditorProps) {
  const setRolePermissions = useSetRolePermissions();
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [editedPermissionIds, setEditedPermissionIds] = useState<
    string[] | null
  >(null);

  const resolvedRoleId = selectedRoleId ?? roles[0]?.id ?? null;

  const selectedRole = useMemo(
    () => roles.find((role) => role.id === resolvedRoleId) ?? null,
    [roles, resolvedRoleId],
  );

  const rolePermissionIds = useMemo(
    () => selectedRole?.permissions?.map((item) => item.permission.id) ?? [],
    [selectedRole],
  );

  const selectedPermissionIds = editedPermissionIds ?? rolePermissionIds;

  function handleRoleChange(roleId: string) {
    setSelectedRoleId(roleId);
    setEditedPermissionIds(null);
  }

  function togglePermission(permissionId: string, checked: boolean) {
    setEditedPermissionIds((previous) => {
      const current = previous ?? rolePermissionIds;

      return checked
        ? [...current, permissionId]
        : current.filter((id) => id !== permissionId);
    });
  }

  async function handleSaveRolePermissions() {
    if (!resolvedRoleId) {
      return;
    }

    await setRolePermissions.mutateAsync({
      roleId: resolvedRoleId,
      permissionIds: selectedPermissionIds,
    });
    setEditedPermissionIds(null);
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-foreground">Permissões do papel</CardTitle>
        <CardDescription>
          Selecione um papel e redefina as permissões associadas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Field orientation="vertical" className="gap-2">
          <FieldLabel htmlFor="role-permissions-select">Papel</FieldLabel>
          <Select
            value={resolvedRoleId}
            onValueChange={(value) => handleRoleChange(value ?? "")}
            items={roles.map((role) => ({
              label: role.name,
              value: role.id,
            }))}
          >
            <SelectTrigger id="role-permissions-select" className="w-full">
              <SelectValue placeholder="Selecione um papel" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <div className="max-h-80 space-y-3 overflow-auto rounded-md border border-border p-4">
          {permissions.map((permission) => (
            <label
              key={permission.id}
              className="flex cursor-pointer items-start gap-3"
            >
              <Checkbox
                checked={selectedPermissionIds.includes(permission.id)}
                onCheckedChange={(checked) =>
                  togglePermission(permission.id, checked === true)
                }
              />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {permission.code}
                </p>
                <p className="text-xs text-muted-foreground">
                  {permission.description || "Sem descrição"}
                </p>
              </div>
            </label>
          ))}
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            disabled={!resolvedRoleId}
            loading={setRolePermissions.isPending}
            onClick={handleSaveRolePermissions}
          >
            Salvar permissões
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

type RolesTableProps = {
  roles: Role[];
  isLoading: boolean;
};

export function RolesTable({ roles, isLoading }: RolesTableProps) {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-foreground">Papéis cadastrados</CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Papel</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Permissões</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => {
                const isLastRow = index === SKELETON_ROW_COUNT - 1;

                return (
                  <TableRow
                    key={index}
                    className={cn(
                      "border-border hover:bg-transparent",
                      isLastRow && "border-0",
                    )}
                  >
                    <TableCell className="px-3 py-2.5">
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell className="px-3 py-2.5">
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    <TableCell className="px-3 py-2.5">
                      <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-5 w-20 rounded-full" />
                        <Skeleton className="h-5 w-24 rounded-full" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-muted-foreground">
                  Nenhum papel encontrado.
                </TableCell>
              </TableRow>
            ) : (
              roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="text-foreground">{role.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {role.description || "Sem descrição"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions?.map((item) => (
                        <Badge
                          key={`${role.id}-${item.permission.id}`}
                          variant="category"
                          className="border border-border bg-transparent text-muted-foreground"
                        >
                          {item.permission.code}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
