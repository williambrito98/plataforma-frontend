import { Download } from "lucide-react";

import { cn } from "@/lib/utils";

type FileDownloadButtonProps = {
  label?: string;
  ariaLabel?: string;
  iconSize?: number;
  className?: string;
  onClick?: () => void;
};

export function FileDownloadButton({
  label = "Baixar",
  ariaLabel,
  iconSize = 14,
  className,
  onClick,
}: FileDownloadButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 text-xs leading-4 font-medium text-primary transition-opacity hover:opacity-80",
        // Abaixo de xl ganha forma de botão: área de toque e borda visível
        "max-xl:h-10 max-xl:rounded-md max-xl:border max-xl:border-border max-xl:px-3 max-xl:text-sm max-xl:active:bg-muted",
        className,
      )}
    >
      <Download
        className="shrink-0"
        style={{ width: iconSize, height: iconSize }}
        aria-hidden
      />
      <span>{label}</span>
    </button>
  );
}
