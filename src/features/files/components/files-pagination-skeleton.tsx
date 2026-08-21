import { Skeleton } from "@/components/ui/skeleton";

export function FilesPaginationSkeleton() {
  return (
    <div
      className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
      aria-busy="true"
      aria-label="Carregando paginação"
    >
      <Skeleton className="h-4 w-52" />

      <div className="flex items-center justify-end gap-1">
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
    </div>
  );
}
