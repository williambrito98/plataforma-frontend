import { useMemo } from "react";

import { FilesSelectionBar } from "@/features/files/components/files-selection-bar";
import { FilesTable } from "@/features/files/components/files-table";
import { mockFiles } from "@/features/files/data/mock-files";
import { useFileSelection } from "@/features/files/hooks/use-file-selection";

export function FilesPage() {
  const fileIds = useMemo(() => mockFiles.map((file) => file.id), []);

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
    () => mockFiles.filter((file) => selectedFiles.includes(file.id)),
    [selectedFiles],
  );

  return (
    <div className="flex flex-col gap-8">
      <FilesTable
        files={mockFiles}
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
