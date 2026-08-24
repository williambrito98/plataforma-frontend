import { ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logoW from "@/assets/brand/logo-w.svg";
import { BrandLogo } from "@/features/companies/components/brand-logo";
import { useSelectedCompany } from "@/features/companies/hooks/use-selected-company";
import { useSwitchCompany } from "@/features/companies/hooks/use-switch-company";
import { cn } from "@/lib/utils";

type CompanySwitcherProps = {
  className?: string;
};

export function CompanySwitcher({ className }: CompanySwitcherProps) {
  const {
    companies,
    selectedCompany,
    selectedCompanyId,
    hasMultipleCompanies,
  } = useSelectedCompany();
  const switchCompany = useSwitchCompany();

  if (!hasMultipleCompanies || companies.length === 0) {
    return null;
  }

  const activeCompany = selectedCompany ?? companies[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 gap-2 border-border bg-background px-3 font-normal",
              className,
            )}
          />
        }
      >
        <BrandLogo className="size-4 max-h-4 max-w-4" />
        <span className="max-w-40 truncate">{activeCompany.name}</span>
        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Empresas
          </DropdownMenuLabel>
          {companies.map((company) => (
            <DropdownMenuItem
              key={company.id}
              disabled={switchCompany.isPending}
              className={cn(
                company.id === selectedCompanyId && "bg-accent font-medium",
              )}
              onClick={() => {
                if (company.id !== selectedCompanyId) {
                  switchCompany.mutate(company.id);
                }
              }}
            >
              <img
                src={company.logoUrl ?? logoW}
                alt={company.name}
                className="size-4 shrink-0 rounded-sm object-contain"
              />
              <span className="truncate">{company.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
