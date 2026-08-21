export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PaginatedApiResponse<T> = {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
  timestamp: string;
};

export type PaginatedResult<T> = {
  items: T[];
  meta: PaginationMeta;
};
