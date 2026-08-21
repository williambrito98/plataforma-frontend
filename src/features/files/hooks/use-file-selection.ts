import { useCallback, useMemo, useState } from "react";

type UseFileSelectionOptions = {
  fileIds: string[];
};

export function useFileSelection({ fileIds }: UseFileSelectionOptions) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());

  const selectedCount = selectedIds.size;

  const isAllSelected =
    fileIds.length > 0 && fileIds.every((id) => selectedIds.has(id));

  const isIndeterminate = selectedCount > 0 && !isAllSelected;

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds],
  );

  const toggle = useCallback((id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedIds((current) => {
      if (fileIds.every((id) => current.has(id))) {
        return new Set();
      }

      return new Set(fileIds);
    });
  }, [fileIds]);

  const selectedFiles = useMemo(
    () => fileIds.filter((id) => selectedIds.has(id)),
    [fileIds, selectedIds],
  );

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  return {
    selectedCount,
    isAllSelected,
    isIndeterminate,
    isSelected,
    toggle,
    toggleAll,
    clearSelection,
    selectedFiles,
  };
}
