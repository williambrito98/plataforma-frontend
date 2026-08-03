import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Permission } from "@/features/rbac/types/rbac";

type PermissionsTableProps = {
  permissions: Permission[];
  isLoading: boolean;
};

export function PermissionsTable({
  permissions,
  isLoading,
}: PermissionsTableProps) {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-foreground">
          Permissões cadastradas
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Descrição</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={2} className="text-muted-foreground">
                  Carregando permissões...
                </TableCell>
              </TableRow>
            ) : permissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-muted-foreground">
                  Nenhuma permissão encontrada.
                </TableCell>
              </TableRow>
            ) : (
              permissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell className="text-foreground">
                    {permission.code}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {permission.description || "Sem descrição"}
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
