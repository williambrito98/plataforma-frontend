import { useEffect } from "react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { alertToast } from "@/components/ui/sonner";
import { AutomationCard } from "@/features/automations/components/automation-card";
import { useExecutions } from "@/features/automations/hooks/use-executions";

function AutomationsListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="px-6 py-4">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="mt-2 h-4 w-24" />
        </Card>
      ))}
    </div>
  );
}

export function AutomationsList() {
  const { data: executions = [], isLoading, isError, error } = useExecutions();

  useEffect(() => {
    if (isError) {
      console.log(error);
      alertToast.error(
        "Erro ao carregar automações",
        error instanceof Error ? error.message : undefined,
      );
    }
  }, [isError, error]);

  if (isLoading) {
    return <AutomationsListSkeleton />;
  }

  if (executions.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Nenhuma automação disponível.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {executions.map((execution) => (
        <AutomationCard key={execution.executionId} execution={execution} />
      ))}
    </div>
  );
}
