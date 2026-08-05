import {
  formatDisplayDate,
  formatElapsedTime,
} from "@/features/automations/utils/format-execution-dates";
import type {
  AutomationCategorySlug,
  AutomationRuntime,
} from "@/features/automations/types/automation";
import { Badge } from "@/components/ui/badge";

type AutomationCardMetadataProps = {
  categorySlug: AutomationCategorySlug;
  categoryLabel: string;
  runtime: AutomationRuntime;
};

export function AutomationCardMetadata({
  categorySlug,
  categoryLabel,
  runtime,
}: AutomationCardMetadataProps) {
  return (
    <div className="w-55 min-w-0 space-y-4">
      <dl className="grid gap-4">
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

        <div className="space-y-1">
          <dt className="text-sm text-muted-foreground">Categoria</dt>
          <dd>
            <Badge variant="category" category={categorySlug} className="w-fit">
              {categoryLabel}
            </Badge>
          </dd>
        </div>
      </dl>
    </div>
  );
}
