import { useEffect } from "react";
import { Container } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { alertToast } from "@/components/ui/sonner";
import { useAutomations } from "@/features/automations/hooks/use-automations";

type CompanyAutomationsSectionProps = {
  selectedAutomationIds: string[];
  onSelectionChange: (automationIds: string[]) => void;
  description?: string;
};

export function CompanyAutomationsSection({
  selectedAutomationIds,
  onSelectionChange,
  description = "Selecione as automações vinculadas à empresa. Cada nova automação selecionada gerará uma execução inicial.",
}: CompanyAutomationsSectionProps) {
  const {
    data: automations = [],
    isLoading: isAutomationsLoading,
    isError: isAutomationsError,
    error: automationsError,
  } = useAutomations();

  useEffect(() => {
    if (isAutomationsError) {
      alertToast.error(
        "Erro ao carregar automações",
        automationsError instanceof Error
          ? automationsError.message
          : undefined,
      );
    }
  }, [isAutomationsError, automationsError]);

  function toggleAutomation(automationId: string, checked: boolean) {
    onSelectionChange(
      checked
        ? [...selectedAutomationIds, automationId]
        : selectedAutomationIds.filter((id) => id !== automationId),
    );
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-foreground">
          <Container className="size-5" aria-hidden />
          Automações
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isAutomationsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={`automation-skeleton-${index}`}
                className="h-10 w-full"
              />
            ))}
          </div>
        ) : null}

        {!isAutomationsLoading && automations.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma automação disponível no catálogo.
          </p>
        ) : null}

        {!isAutomationsLoading && automations.length > 0 ? (
          <div className="max-h-80 space-y-3 overflow-auto rounded-md border border-border p-4">
            {automations.map((automation) => (
              <label
                key={automation.id}
                className="flex cursor-pointer items-start gap-3"
              >
                <Checkbox
                  checked={selectedAutomationIds.includes(automation.id)}
                  onCheckedChange={(checked) =>
                    toggleAutomation(automation.id, checked === true)
                  }
                />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    {automation.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {automation.category.name}
                    {automation.description
                      ? ` · ${automation.description}`
                      : ""}
                  </p>
                </div>
              </label>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
