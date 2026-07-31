import { cn } from "@/lib/utils";

import chevronUpIcon from "@/assets/admin/icons/chevron-up.svg";
import containerIcon from "@/assets/admin/icons/container.svg";
import folderTreeIcon from "@/assets/admin/icons/folder-tree.svg";
import logoWIcon from "@/assets/admin/icons/logo-w.svg";
import moonIcon from "@/assets/admin/icons/moon.svg";
import panelToggleCloseIcon from "@/assets/admin/icons/panel-toggle-close.svg";
import panelToggleOpenIcon from "@/assets/admin/icons/panel-toggle-open.svg";
import downloadIcon from "@/assets/admin/icons/download.svg";
import settings2Icon from "@/assets/admin/icons/settings-2.svg";

import type { AdminNavIcon } from "@/features/admin/types/admin-navigation";

const iconMap = {
  container: containerIcon,
  "folder-tree": folderTreeIcon,
  "settings-2": settings2Icon,
  download: downloadIcon,
  moon: moonIcon,
  "chevron-up": chevronUpIcon,
  "panel-toggle-close": panelToggleCloseIcon,
  "panel-toggle-open": panelToggleOpenIcon,
  logo: logoWIcon,
} as const;

type AdminIconName = AdminNavIcon | keyof typeof iconMap;

type AdminIconProps = {
  name: AdminIconName;
  className?: string;
  size?: number;
};

export function AdminIcon({ name, className, size = 16 }: AdminIconProps) {
  const src = iconMap[name as keyof typeof iconMap];

  return (
    <span
      className={cn("inline-flex shrink-0 overflow-hidden", className)}
      style={{ width: size, height: size }}
    >
      <img
        src={src}
        alt=""
        aria-hidden
        className="size-full max-w-none object-contain"
      />
    </span>
  );
}
