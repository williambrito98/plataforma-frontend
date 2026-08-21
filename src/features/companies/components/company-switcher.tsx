import { Building2, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
        <Building2 className="size-4 shrink-0 text-muted-foreground" />
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
              <Building2 className="size-4" />
              <span className="truncate">{company.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
