import { AutomationCard } from "@/features/automations/components/automation-card";
import { useAutomationsRuntimeTicker } from "@/features/automations/hooks/use-automations-runtime-ticker";
import { MOCK_AUTOMATIONS } from "@/features/automations/mocks/automations";

export function AutomationsList() {
  useAutomationsRuntimeTicker();

  return (
    <div className="flex flex-col gap-4">
      {MOCK_AUTOMATIONS.map((automation) => (
        <AutomationCard key={automation.id} automation={automation} />
      ))}
    </div>
  );
}
