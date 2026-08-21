import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/lib/pagination";

export const filesQueryKeys = {
  all: ["files"] as const,
  list: (companyId: string, page = DEFAULT_PAGE, limit = DEFAULT_PAGE_SIZE) =>
    ["files", companyId, page, limit] as const,
};
