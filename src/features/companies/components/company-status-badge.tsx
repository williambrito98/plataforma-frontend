import { Badge } from "@/components/ui/badge";
import type { CompanyStatus } from "@/features/companies/types/company";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<
  CompanyStatus,
  { label: string; badgeVariant: "success" | "warning" }
> = {
  ATIVA: { label: "Ativa", badgeVariant: "success" },
  INATIVA: { label: "Inativa", badgeVariant: "warning" },
};

type CompanyStatusBadgeProps = {
  status: CompanyStatus;
  className?: string;
};

export function CompanyStatusBadge({
  status,
  className,
}: CompanyStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <Badge
      variant={config.badgeVariant}
      category={config.badgeVariant}
      className={cn("w-fit", className)}
    >
      {config.label}
    </Badge>
  );
}
