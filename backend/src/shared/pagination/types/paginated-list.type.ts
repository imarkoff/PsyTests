import { PaginationParams } from './pagination-params.type';

export interface PaginatedList<T extends object> extends PaginationParams<T> {
  items: T[];
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
