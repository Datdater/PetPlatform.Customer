export interface PaginationResponse<T> {
  totalItemsCount: number;
  pageSize: number;
  pageIndex: number;
  totalPagesCount: number;
  next: boolean;
  previous: boolean;
  items: T[];
} 