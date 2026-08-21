import { useEffect, useMemo, useState } from "react";

import { alertToast } from "@/components/ui/sonner";
import { useSelectedCompanyId } from "@/features/companies/stores/company-store";
import { FilesPagination } from "@/features/files/components/files-pagination";
import { FilesPaginationSkeleton } from "@/features/files/components/files-pagination-skeleton";
import { FilesSelectionBar } from "@/features/files/components/files-selection-bar";
import { FilesTable } from "@/features/files/components/files-table";
import { FilesTableSkeleton } from "@/features/files/components/files-table-skeleton";
import { useFileSelection } from "@/features/files/hooks/use-file-selection";
import { useFiles } from "@/features/files/hooks/use-files";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/lib/pagination";

export function FilesPage() {
  const selectedCompanyId = useSelectedCompanyId();
  const [page, setPage] = useState(DEFAULT_PAGE);

  const { data, isLoading, isFetching, isError, error } = useFiles({
    page,
    limit: DEFAULT_PAGE_SIZE,
  });

  const files = data?.items ?? [];
  const meta = data?.meta;

  useEffect(() => {
    setPage(DEFAULT_PAGE);
  }, [selectedCompanyId]);

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
    clearSelection,
    selectedFiles,
  } = useFileSelection({ fileIds });

  useEffect(() => {
    clearSelection();
  }, [page, clearSelection]);

  const selectedFileItems = useMemo(
    () => files.filter((file) => selectedFiles.includes(file.id)),
    [files, selectedFiles],
  );

  const showInitialSkeleton = isLoading && !data;

  if (showInitialSkeleton) {
    return (
      <div className="flex flex-col gap-8">
        <FilesTableSkeleton />
        <FilesPaginationSkeleton />
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

      {meta ? (
        <FilesPagination
          meta={meta}
          onPageChange={setPage}
          isLoading={isFetching}
        />
      ) : null}

      <FilesSelectionBar
        selectedCount={selectedCount}
        selectedFiles={selectedFileItems}
      />
    </div>
  );
}
