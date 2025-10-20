import { SortDirection } from '../enums/sort-direction.enum';
import { FilterOperator } from '../enums/filter-operator.enum';

export interface PaginationParams<T extends object> {
  page: number;
  pageSize: number;
  sortedFields: SortedField<T>[];
  quickFilter?: QuickFilter;
  filter?: Filter<T>;
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
