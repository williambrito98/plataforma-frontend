import { cva, type VariantProps } from "class-variance-authority";
import {
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "flex w-full items-start gap-3 rounded-lg border border-border bg-secondary px-4 py-3 text-sm",
  {
    variants: {
      variant: {
        success: "",
        warning: "",
        error: "",
        info: "",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
);

const alertTitleVariants = cva("font-medium", {
  variants: {
    variant: {
      success: "text-success-foreground",
      warning: "text-warning-foreground",
      error: "text-error-foreground",
      info: "text-info-foreground",
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

const alertIcons: Record<
  NonNullable<VariantProps<typeof alertVariants>["variant"]>,
  LucideIcon
> = {
  success: ShieldCheck,
  warning: ShieldAlert,
  error: ShieldX,
  info: Sparkles,
};

type AlertProps = React.ComponentProps<"div"> &
  VariantProps<typeof alertVariants> & {
    title: string;
    description?: string;
  };

function Alert({
  className,
  variant = "info",
  title,
  description,
  ...props
}: AlertProps) {
  const Icon = alertIcons[variant ?? "info"];

  return (
    <div
      role="alert"
      data-slot="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <Icon className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className={cn(alertTitleVariants({ variant }))}>{title}</p>
        {description ? (
          <p className="text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </div>
  );
}

export { Alert, alertVariants, alertTitleVariants, alertIcons };
export type { AlertProps };
