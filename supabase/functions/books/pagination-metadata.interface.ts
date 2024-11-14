export interface PaginationMetadata {
  prevPage: number | null;
  currPage: number | null;
  nextPage: number | null;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}
