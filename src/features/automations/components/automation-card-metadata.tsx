import {
  formatDisplayDate,
  formatElapsedTime,
} from "@/features/automations/mocks/automations";
import type {
  AutomationCategorySlug,
  AutomationRuntime,
} from "@/features/automations/types/automation";
import { Badge } from "@/components/ui/badge";

type AutomationCardMetadataProps = {
  category: AutomationCategorySlug;
  categoryLabel: string;
  runtime: AutomationRuntime;
};

export function AutomationCardMetadata({
  category,
  categoryLabel,
  runtime,
}: AutomationCardMetadataProps) {
  return (
    <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
      <dl className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1">
          <dt className="text-sm text-muted-foreground">Iniciado em</dt>
          <dd className="text-sm font-medium text-foreground">
            {formatDisplayDate(runtime.startedAt)}
          </dd>
        </div>
        <div className="space-y-1">
          <dt className="text-sm text-muted-foreground">Tempo decorrido</dt>
          <dd className="text-sm font-medium text-foreground">
            {runtime.elapsedSeconds > 0
              ? formatElapsedTime(runtime.elapsedSeconds)
              : "--:--:--"}
          </dd>
        </div>
        <div className="space-y-1">
          <dt className="text-sm text-muted-foreground">Terminado em</dt>
          <dd className="text-sm font-medium text-foreground">
            {formatDisplayDate(runtime.finishedAt)}
          </dd>
        </div>
      </dl>

      <Badge variant="category" category={category} className="w-fit">
        {categoryLabel}
      </Badge>
    </div>
  );
}
