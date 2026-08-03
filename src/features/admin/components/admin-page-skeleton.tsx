import { Skeleton } from "@/components/ui/skeleton";

export function AdminPageSkeleton() {
  return (
    <div
      className="flex flex-col gap-6"
      aria-busy="true"
      aria-label="Carregando página"
    >
      <Skeleton className="h-32 w-full rounded-md" />
      <div className="overflow-hidden rounded-md border border-border">
        <div className="border-b border-border px-6 py-4">
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="space-y-3 p-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}
