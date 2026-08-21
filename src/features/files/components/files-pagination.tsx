import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { PaginationMeta } from "@/lib/pagination";

type FilesPaginationProps = {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
};

export function FilesPagination({
  meta,
  onPageChange,
  isLoading = false,
}: FilesPaginationProps) {
  if (meta.totalPages <= 1) {
    return null;
  }

  const hasPreviousPage = meta.page > 1;
  const hasNextPage = meta.page < meta.totalPages;

  return (
    <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs leading-4 text-muted-foreground">
        {meta.total} arquivo(s) · Página {meta.page} de {meta.totalPages}
      </p>

      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              text="Anterior"
              className={
                !hasPreviousPage || isLoading
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
              onClick={(event) => {
                event.preventDefault();
                if (hasPreviousPage && !isLoading) {
                  onPageChange(meta.page - 1);
                }
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              text="Próxima"
              className={
                !hasNextPage || isLoading
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
              onClick={(event) => {
                event.preventDefault();
                if (hasNextPage && !isLoading) {
                  onPageChange(meta.page + 1);
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
