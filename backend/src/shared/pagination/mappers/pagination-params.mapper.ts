import { QueryPaginationParams } from '../types/query-pagination-params.type';
import {
  Filters,
  PaginationParams,
  QuickFilters,
  SortedField,
} from '../types/pagination-params.type';
import { SortDirection } from '../enums/sort-direction.enum';
import { FilterOperator } from '../enums/filter-operator.enum';
import { InvalidSortDirectionException } from '../exceptions/invalid-sort-direction.exception';
import { InvalidSortedFieldFormatException } from '../exceptions/invalid-sorted-field-format.exception';
import { InvalidFilterFormatException } from '../exceptions/invalid-filter-format.exception';

/**
 * Mapper class to convert query pagination parameters into structured pagination parameters.
 */
export class PaginationParamsMapper {
  /**
   * Converts query pagination parameters into structured pagination parameters.
   * @param query - The query pagination parameters.
   * @returns The structured pagination parameters.
   */
  static toPaginationParams<T extends object>(
    query: QueryPaginationParams,
  ): PaginationParams<T> {
    return {
      page: query.page,
      pageSize: query.pageSize,
      sortedFields: this.parseSortedFields(query.sortedFields),
      quickFilters: this.parseQuickFilters(
        query.quickFilters,
        query.quickFiltersOperator,
      ),
      filters: this.parseFilters(query.filters, query.filtersOperator),
    };
  }

  private static parseSortedFields<T extends object>(
    sortedFieldsStr: string | undefined,
  ): SortedField<T>[] {
    if (!sortedFieldsStr || sortedFieldsStr.trim() === '') {
      return [];
    }

    return sortedFieldsStr
      .trim()
      .split(';')
      .map((notParsedField): SortedField<T> => {
        const parts = notParsedField.trim().split(':');

        if (parts.length !== 2) {
          throw new InvalidSortedFieldFormatException(notParsedField);
        }

        const [field, direction] = parts;

        if (!(direction in SortDirection)) {
          throw new InvalidSortDirectionException(direction);
        }

        return {
          field: field as keyof T,
          direction: direction as SortDirection,
        };
      });
  }

  private static parseQuickFilters(
    quickFiltersStr: string | undefined,
    quickFiltersOperator: FilterOperator,
  ): QuickFilters | null {
    if (!quickFiltersStr || quickFiltersStr.trim() === '') {
      return null;
    }

    return {
      filters: quickFiltersStr.trim().split(' '),
      operator: quickFiltersOperator,
    };
  }

  private static parseFilters<T extends object>(
    filtersStr: string | undefined,
    filtersOperator: FilterOperator,
  ): Filters<T> | null {
    if (!filtersStr || filtersStr.trim() === '') {
      return null;
    }

    const filters = filtersStr
      .trim()
      .split(';')
      .map((notParsedFilter) => {
        const parts = notParsedFilter.trim().split(':');

        if (parts.length !== 3) {
          throw new InvalidFilterFormatException(notParsedFilter);
        }

        const [field, operator, value] = parts;

        return {
          field: field as keyof T,
          operator,
          value,
        };
      });

    return {
      filters: filters,
      operator: filtersOperator,
    };
  }
}
