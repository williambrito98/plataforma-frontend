import logoW from "@/assets/brand/logo-w.svg";

import { useSelectedCompany } from "@/features/companies/hooks/use-selected-company";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
};

export function BrandLogo({ className }: BrandLogoProps) {
  const { selectedCompany } = useSelectedCompany();
  const src = selectedCompany?.logoUrl ?? logoW;
  const alt = selectedCompany?.name ?? "Wimpra";

  return (
    <img
      src={src}
      alt={alt}
      className={cn("h-9 w-10.75 shrink-0 object-contain", className)}
    />
  );
}
