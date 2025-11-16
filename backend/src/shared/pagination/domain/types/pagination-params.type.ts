import { SortDirection } from '../enums/sort-direction.enum';
import { FilterOperator } from '../enums/filter-operator.enum';

/**
 * Pagination parameters for querying paginated data.
 * @template TModel - The type of the model entity. Model type because sorting and filtering are done on model fields.
 */
export interface PaginationParams<TModel extends object> {
  page: number;
  pageSize: number;
  sortedFields: SortedField<TModel>[];
  quickFilters: QuickFilters | null;
  filters: Filters<TModel> | null;
}

export interface SortedField<T extends object> {
  field: keyof T;
  direction: SortDirection;
}

export interface QuickFilters {
  filters: string[];
  operator: FilterOperator;
}

export interface Filters<T extends object> {
  filters: FilterField<T>[];
  operator: FilterOperator;
}

export interface FilterField<T extends object> {
  field: keyof T;
  operator: string;
  value: string | number | boolean | null;
}
