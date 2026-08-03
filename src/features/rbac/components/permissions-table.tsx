import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Permission } from "@/features/rbac/types/rbac";
import { cn } from "@/lib/utils";

const SKELETON_ROW_COUNT = 5;

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
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell className="px-3 py-2.5">
                      <Skeleton className="h-4 w-64" />
                    </TableCell>
                  </TableRow>
                );
              })
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
