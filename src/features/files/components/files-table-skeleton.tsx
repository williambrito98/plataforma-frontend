import { Skeleton } from "@/components/ui/skeleton";
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
import { cn } from "@/lib/utils";

const SKELETON_ROW_COUNT = 5;

export function FilesTableSkeleton() {
  const canDownload = useCan(PermissionCodes.FILES_DOWNLOAD);

  return (
    <div
      className="w-full overflow-hidden rounded-md"
      aria-busy="true"
      aria-label="Carregando arquivos"
    >
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="h-auto w-12 px-4 py-2.5" />
            <TableHead className="h-auto w-64 px-3 py-2 text-xs leading-4 font-semibold">
              Nome
            </TableHead>
            <TableHead className="h-auto w-44 px-3 py-2 text-xs leading-4 font-semibold">
              Data de criação
            </TableHead>
            <TableHead className="h-auto px-3 py-2 text-right text-xs leading-4 font-semibold">
              Tamanho
            </TableHead>
            {canDownload ? (
              <TableHead className="h-auto px-3 py-2 text-right text-xs leading-4 font-semibold">
                Ações
              </TableHead>
            ) : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => {
            const isLastRow = index === SKELETON_ROW_COUNT - 1;

            return (
              <TableRow
                key={index}
                className={cn(
                  "border-border hover:bg-transparent",
                  isLastRow && "border-0",
                )}
              >
                <TableCell className="w-12 px-4 py-3">
                  <div className="flex items-center justify-center">
                    <Skeleton className="size-3 rounded-[3px]" />
                  </div>
                </TableCell>
                <TableCell className="w-64 max-w-64 px-3 py-2.5">
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell className="w-44 max-w-44 px-3 py-2.5">
                  <Skeleton className="h-4 w-28" />
                </TableCell>
                <TableCell className="px-3 py-2.5">
                  <div className="flex justify-end">
                    <Skeleton className="h-4 w-12" />
                  </div>
                </TableCell>
                {canDownload ? (
                  <TableCell className="px-3 py-2.5">
                    <div className="flex justify-end">
                      <Skeleton className="h-4 w-14" />
                    </div>
                  </TableCell>
                ) : null}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
