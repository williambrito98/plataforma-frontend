import { Button } from "@/components/ui/button";
import { AdminIcon } from "@/features/admin/components/admin-icon";
import type { FileItem } from "@/features/files/types/file";
import { alertToast } from "@/components/ui/sonner";

type FilesSelectionBarProps = {
  selectedCount: number;
  selectedFiles: FileItem[];
};

export function FilesSelectionBar({
  selectedCount,
  selectedFiles,
}: FilesSelectionBarProps) {
  if (selectedCount === 0) {
    return null;
  }

  function handleDownloadSelected() {
    const names = selectedFiles.map((file) => file.name).join(", ");
    alertToast.success(`${selectedCount} arquivo(s) selecionado(s): ${names}`);
  }

  return (
    <div className="flex w-full items-center justify-between">
      <p className="text-xs leading-4 text-foreground">
        {selectedCount} arquivo(s) selecionado(s)
      </p>
      <Button
        type="button"
        variant="outline"
        onClick={handleDownloadSelected}
        className="h-auto gap-2 rounded-[5px] border-primary px-2.5 py-1.5 text-xs leading-4 font-medium text-primary hover:bg-transparent hover:text-primary"
      >
        <AdminIcon name="download" size={16} />
        Baixar selecionados
      </Button>
    </div>
  );
}
