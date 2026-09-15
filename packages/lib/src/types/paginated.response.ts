export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
  message?: string;
}

