import type { AutomationCategorySlug } from "@/features/automations/types/automation";

const CATEGORY_SLUG_MAP: Record<string, AutomationCategorySlug> = {
  fiscal: "fiscal",
  contabil: "contabil",
  pessoal: "pessoal",
  trabalhista: "trabalhista",
};

export function mapCategorySlug(name: string): AutomationCategorySlug {
  const normalized = name.trim().toLowerCase();
  return CATEGORY_SLUG_MAP[normalized] ?? "fiscal";
}
