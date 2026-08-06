import { computeElapsedSeconds } from "@/features/automations/utils/format-execution-dates";
import { mapCategorySlug } from "@/features/automations/utils/map-category-slug";
import { mapExecutionStatus } from "@/features/automations/utils/map-execution-status";
import { parseAutomationFields } from "@/features/automations/utils/parse-automation-fields";
import type {
  AutomationRuntime,
  ExecutionApiResponse,
  ExecutionListItem,
} from "@/features/automations/types/automation";

export function normalizeExecution(
  execution: ExecutionApiResponse,
): ExecutionListItem {
  const automation = execution.automation;

  return {
    executionId: execution.id,
    automationId: execution.automationId,
    name: automation?.name ?? "Automação sem nome",
    description: automation?.description ?? null,
    categoryId: automation?.category.id ?? "",
    categoryLabel: automation?.category.name ?? "—",
    categorySlug: mapCategorySlug(automation?.category.name ?? ""),
    fields: parseAutomationFields(automation?.fields),
    status: mapExecutionStatus(execution.status),
    startedAt: execution.startedAt,
    finishedAt: execution.finishedAt,
    dataConsole: execution.dataConsole
      ? JSON.parse(execution.dataConsole)
      : null,
  };
}

export function createRuntimeFromExecution(
  item: ExecutionListItem,
): AutomationRuntime {
  return {
    status: item.status,
    processed: 0,
    total: 0,
    startedAt: item.startedAt,
    finishedAt: item.finishedAt,
    elapsedSeconds: computeElapsedSeconds(item.startedAt, item.finishedAt),
    logs: [],
    submittedValues: {},
  };
}
