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
  quickFilter?: QuickFilter;
  filter?: Filter<TModel>;
}

export interface SortedField<T extends object> {
  field: keyof T;
  direction: SortDirection;
}

export interface QuickFilter {
  filters: string[];
  operator: FilterOperator;
}

export interface Filter<T extends object> {
  filters: FilterField<T>[];
  operator: FilterOperator;
}

export interface FilterField<T extends object> {
  field: keyof T;
  operator: string;
  value: string | number | boolean | null;
}
