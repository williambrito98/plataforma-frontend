import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { alertToast } from "@/components/ui/sonner";
import type { FileItem } from "@/features/files/types/file";

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
        <Download className="size-4 shrink-0" aria-hidden />
        Baixar selecionados
      </Button>
    </div>
  );
}
