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
  showLogo?: boolean;
};

export function CompanySwitcher({
  className,
  showLogo = true,
}: CompanySwitcherProps) {
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
            variant={showLogo ? "outline" : "ghost"}
            size="sm"
            className={cn(
              showLogo
                ? "h-8 gap-2 border-border bg-background px-3 font-normal"
                : "h-auto min-h-9 min-w-0 gap-1.5 px-2 py-1 font-normal hover:bg-accent",
              className,
            )}
          />
        }
      >
        {showLogo ? <BrandLogo className="size-4 max-h-4 max-w-4" /> : null}
        <div className="min-w-0 flex-1 text-left">
          <span className="block truncate">{activeCompany.name}</span>
          {activeCompany.document ? (
            <span className="block truncate text-xs text-muted-foreground">
              {activeCompany.document}
            </span>
          ) : null}
        </div>
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
              <div className="min-w-0 flex-1">
                <span className="block truncate">{company.name}</span>
                {company.document ? (
                  <span className="block truncate text-xs text-muted-foreground">
                    {company.document}
                  </span>
                ) : null}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
