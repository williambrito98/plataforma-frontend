import { useEffect, useMemo } from "react";

import { alertToast } from "@/components/ui/sonner";
import { FilesSelectionBar } from "@/features/files/components/files-selection-bar";
import { FilesTable } from "@/features/files/components/files-table";
import { FilesTableSkeleton } from "@/features/files/components/files-table-skeleton";
import { useFileSelection } from "@/features/files/hooks/use-file-selection";
import { useFiles } from "@/features/files/hooks/use-files";

export function FilesPage() {
  const { data: files = [], isLoading, isError, error } = useFiles();

  useEffect(() => {
    if (isError) {
      alertToast.error(
        "Erro ao carregar arquivos",
        error instanceof Error ? error.message : undefined,
      );
    }
  }, [isError, error]);

  const fileIds = useMemo(() => files.map((file) => file.id), [files]);

  const {
    selectedCount,
    isAllSelected,
    isIndeterminate,
    isSelected,
    toggle,
    toggleAll,
    selectedFiles,
  } = useFileSelection({ fileIds });

  const selectedFileItems = useMemo(
    () => files.filter((file) => selectedFiles.includes(file.id)),
    [files, selectedFiles],
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <FilesTableSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <FilesTable
        files={files}
        isSelected={isSelected}
        isAllSelected={isAllSelected}
        isIndeterminate={isIndeterminate}
        onToggle={toggle}
        onToggleAll={toggleAll}
      />
      <FilesSelectionBar
        selectedCount={selectedCount}
        selectedFiles={selectedFileItems}
      />
    </div>
  );
}
