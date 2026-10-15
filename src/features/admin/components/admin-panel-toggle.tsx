import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type AdminPanelToggleProps = {
  className?: string;
};

export function AdminPanelToggle({ className }: AdminPanelToggleProps) {
  const { open, openMobile, isMobile, toggleSidebar } = useSidebar();

  // No mobile/tablet o estado relevante é o do drawer, não o da sidebar fixa.
  const isOpen = isMobile ? openMobile : open;
  const label = isMobile
    ? isOpen
      ? "Fechar menu de navegação"
      : "Abrir menu de navegação"
    : isOpen
      ? "Recolher menu lateral"
      : "Expandir menu lateral";

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label={label}
      aria-expanded={isOpen}
      className={cn(
        "inline-flex size-4 shrink-0 cursor-pointer items-center justify-center text-muted-foreground transition-opacity hover:opacity-80 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "max-xl:-ml-2 max-xl:size-11 max-xl:rounded-md max-xl:text-foreground max-xl:hover:bg-accent max-xl:hover:opacity-100 max-xl:active:bg-accent",
        className,
      )}
    >
      {isMobile ? (
        <Menu className="size-5" aria-hidden />
      ) : open ? (
        <PanelLeftClose className="size-4" aria-hidden />
      ) : (
        <PanelLeftOpen className="size-4" aria-hidden />
      )}
    </button>
  );
}
