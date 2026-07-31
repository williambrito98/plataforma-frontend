import { AdminIcon } from "@/features/admin/components/admin-icon";
import { cn } from "@/lib/utils";

type FileDownloadButtonProps = {
  label?: string;
  iconSize?: number;
  className?: string;
  onClick?: () => void;
};

export function FileDownloadButton({
  label = "Baixar",
  iconSize = 14,
  className,
  onClick,
}: FileDownloadButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 text-xs leading-4 font-medium text-primary transition-opacity hover:opacity-80",
        className,
      )}
    >
      <AdminIcon name="download" size={iconSize} />
      <span>{label}</span>
    </button>
  );
}
