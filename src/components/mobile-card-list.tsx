import * as React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Lista de cards usada no lugar de tabelas em telas pequenas (< md).
 *
 * Cada linha da tabela vira um card com título no topo, pares rótulo/valor
 * no meio e ações com texto no rodapé — alvos de toque grandes e rótulos
 * explícitos no lugar de colunas e ícones isolados.
 *
 * A tabela correspondente deve ficar com `max-md:hidden`; esta lista já
 * vem com `md:hidden`, então o desktop não é afetado.
 */
function MobileCardList({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="mobile-card-list"
      className={cn("flex flex-col gap-3 md:hidden", className)}
      {...props}
    />
  );
}

function MobileCardListItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="mobile-card-list-item"
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-border bg-background p-4",
        className,
      )}
      {...props}
    />
  );
}

type MobileCardHeaderProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  leading?: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
};

function MobileCardHeader({
  title,
  subtitle,
  leading,
  aside,
  className,
}: MobileCardHeaderProps) {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      {leading ? <div className="shrink-0">{leading}</div> : null}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium wrap-anywhere text-foreground">
          {title}
        </p>
        {subtitle ? (
          <p className="text-sm wrap-anywhere text-muted-foreground">
            {subtitle}
          </p>
        ) : null}
      </div>
      {aside ? <div className="shrink-0">{aside}</div> : null}
    </div>
  );
}

function MobileCardFields({ className, ...props }: React.ComponentProps<"dl">) {
  return (
    <dl
      data-slot="mobile-card-fields"
      className={cn("grid grid-cols-2 gap-3", className)}
      {...props}
    />
  );
}

type MobileCardFieldProps = {
  label: React.ReactNode;
  children: React.ReactNode;
  fullWidth?: boolean;
};

function MobileCardField({ label, children, fullWidth }: MobileCardFieldProps) {
  return (
    <div className={cn("min-w-0 space-y-0.5", fullWidth && "col-span-2")}>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm wrap-anywhere text-foreground">{children}</dd>
    </div>
  );
}

/** Rodapé de ações: botões com texto, mesma largura e 44px de altura. */
function MobileCardActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="mobile-card-actions"
      className={cn(
        "flex gap-2 border-t border-border pt-3 *:h-11 *:flex-1",
        className,
      )}
      {...props}
    />
  );
}

function MobileCardEmpty({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      className={cn(
        "rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function MobileCardSkeletons({ count = 3 }: { count?: number }) {
  return Array.from({ length: count }, (_, index) => (
    <MobileCardListItem key={index} aria-hidden>
      <Skeleton className="h-4 w-2/3" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-8" />
        <Skeleton className="h-8" />
      </div>
      <Skeleton className="h-11 w-full" />
    </MobileCardListItem>
  ));
}

export {
  MobileCardActions,
  MobileCardEmpty,
  MobileCardField,
  MobileCardFields,
  MobileCardHeader,
  MobileCardList,
  MobileCardListItem,
  MobileCardSkeletons,
};
