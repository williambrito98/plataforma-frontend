import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type AdminPanelToggleProps = {
  className?: string;
};

export function AdminPanelToggle({ className }: AdminPanelToggleProps) {
  const { open, toggleSidebar } = useSidebar();

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label={open ? "Recolher menu lateral" : "Expandir menu lateral"}
      className={cn(
        "inline-flex size-4 shrink-0 cursor-pointer items-center justify-center text-muted-foreground transition-opacity hover:opacity-80 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {open ? (
        <PanelLeftClose className="size-4" aria-hidden />
      ) : (
        <PanelLeftOpen className="size-4" aria-hidden />
      )}
    </button>
  );
}
