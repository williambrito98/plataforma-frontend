import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex h-5 shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        category: "bg-badge text-badge-foreground",
        success: "bg-success text-success-foreground",
        warning: "bg-warning text-warning-foreground",
        error: "bg-error text-error-foreground",
        info: "bg-info text-info-foreground",
      },
      category: {
        fiscal: "",
        pessoal: "",
        contabil: "",
        trabalhista: "",
        success: "",
        warning: "",
        error: "",
        info: "",
      },
    },
    defaultVariants: {
      variant: "category",
      category: "fiscal",
    },
  },
);

const badgeDotVariants = cva("size-1.5 shrink-0 rounded-full", {
  variants: {
    variant: {
      category: "",
      success: "bg-success-foreground",
      warning: "bg-warning-foreground",
      error: "bg-error-foreground",
      info: "bg-info-foreground",
    },
    category: {
      fiscal: "bg-category-fiscal",
      pessoal: "bg-category-pessoal",
      contabil: "bg-category-contabil",
      trabalhista: "bg-category-trabalhista",
      success: "bg-success-foreground",
      warning: "bg-warning-foreground",
      error: "bg-error-foreground",
      info: "bg-info-foreground",
    },
  },
  defaultVariants: {
    variant: "category",
    category: "fiscal",
  },
});

type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants>;

function Badge({
  className,
  variant = "category",
  category = "fiscal",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, category }), className)}
      {...props}
    >
      <span
        aria-hidden
        className={cn(badgeDotVariants({ variant, category }))}
      />
      {children}
    </span>
  );
}

export { Badge, badgeVariants, badgeDotVariants };
export type { BadgeProps };
