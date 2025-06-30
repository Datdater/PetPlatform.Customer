export interface PaginationResponse<T> {
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  items: T[];
} 