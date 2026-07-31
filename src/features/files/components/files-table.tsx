import { Checkbox } from "@/components/ui/checkbox";
import { alertToast } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  function handleDownload(file: FileItem) {
    alertToast.success(`Download iniciado: ${file.name}`);
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
            <TableHead className="h-auto px-3 py-2 text-right text-xs leading-4 font-semibold">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file, index) => {
            const isLastRow = index === files.length - 1;

            return (
              <TableRow
                key={file.id}
                className={cn(
                  "border-border hover:bg-transparent",
                  isLastRow && "border-0",
                )}
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
                <TableCell className="px-3 py-2.5">
                  <div className="flex justify-end">
                    <FileDownloadButton onClick={() => handleDownload(file)} />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
