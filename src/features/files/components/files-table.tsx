import { Checkbox } from "@/components/ui/checkbox";
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
import { downloadFile } from "@/features/files/api/download-file";
import { FileDownloadButton } from "@/features/files/components/file-download-button";
import type { FileItem } from "@/features/files/types/file";
import { formatFileDate } from "@/features/files/utils/format-file-date";
import { formatFileSize } from "@/features/files/utils/format-file-size";
import { cn } from "@/lib/utils";

const checkboxClassName =
  "size-3 rounded-[3px] border-[#d4d4d4] shadow-none data-checked:border-primary data-checked:bg-primary [&>span>svg]:size-2.5";

type FilesTableProps = {
  files: FileItem[];
  isSelected: (id: string) => boolean;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
};

export function FilesTable({
  files,
  isSelected,
  isAllSelected,
  isIndeterminate,
  onToggle,
  onToggleAll,
}: FilesTableProps) {
  const canDownload = useCan(PermissionCodes.FILES_DOWNLOAD);

  const columnCount = canDownload ? 5 : 4;

  function handleDownload(file: FileItem) {
    downloadFile(file.token);
  }

  function handleRowClick(
    event: React.MouseEvent<HTMLTableRowElement>,
    fileId: string,
  ) {
    const target = event.target as HTMLElement;

    if (target.closest("button, [data-slot='checkbox']")) {
      return;
    }

    onToggle(fileId);
  }

  return (
    <div className="w-full overflow-hidden rounded-md">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="h-auto w-12 px-4 py-2.5">
              <div className="flex items-center justify-center">
                <Checkbox
                  aria-label="Selecionar todos os arquivos"
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onCheckedChange={onToggleAll}
                  className={checkboxClassName}
                  disabled={files.length === 0}
                />
              </div>
            </TableHead>
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
          {files.length === 0 ? (
            <TableRow className="border-border hover:bg-transparent">
              <TableCell
                colSpan={columnCount}
                className="px-3 py-2.5 text-xs leading-4 text-muted-foreground"
              >
                Nenhum arquivo encontrado.
              </TableCell>
            </TableRow>
          ) : (
            files.map((file, index) => {
              const isLastRow = index === files.length - 1;

              return (
                <TableRow
                  key={file.id}
                  data-state={isSelected(file.id) ? "selected" : undefined}
                  className={cn(
                    "cursor-pointer border-border",
                    isLastRow && "border-0",
                  )}
                  onClick={(event) => handleRowClick(event, file.id)}
                >
                  <TableCell className="w-12 px-4 py-3">
                    <div className="flex items-center justify-center">
                      <Checkbox
                        aria-label={`Selecionar ${file.name}`}
                        checked={isSelected(file.id)}
                        onCheckedChange={() => onToggle(file.id)}
                        className={checkboxClassName}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="w-64 max-w-64 px-3 py-2.5 text-xs leading-4">
                    <span className="block truncate">{file.name}</span>
                  </TableCell>
                  <TableCell className="w-44 max-w-44 px-3 py-2.5 text-xs leading-4">
                    <span className="block truncate">
                      {formatFileDate(file.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-right text-xs leading-4">
                    {formatFileSize(file.sizeBytes)}
                  </TableCell>
                  {canDownload ? (
                    <TableCell className="px-3 py-2.5">
                      <div className="flex justify-end">
                        <FileDownloadButton
                          onClick={() => handleDownload(file)}
                        />
                      </div>
                    </TableCell>
                  ) : null}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
