import { PaginationParams } from './pagination-params.type';

/**
 * Represents a paginated list of items along with pagination metadata.
 * @template TDto - The type of the data transfer object (DTO).
 * @template TModel - The type of the model entity.
 */
export interface PaginatedList<TDto extends object, TModel extends object>
  extends PaginationParams<TModel> {
  items: TDto[];
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
