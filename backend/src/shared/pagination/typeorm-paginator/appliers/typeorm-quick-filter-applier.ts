import { Brackets, SelectQueryBuilder } from 'typeorm';
import { QuickFilters } from '../../types/pagination-params.type';
import { FilterOperator } from '../../enums/filter-operator.enum';

export class TypeOrmQuickFilterApplier {
  applyQuickFilter<TModel extends object>(
    fieldsToFilter: string[],
    queryBuilder: SelectQueryBuilder<TModel>,
    quickFilters: QuickFilters | null,
  ): void {
    if (!quickFilters || !quickFilters.filters.length) {
      return;
    }

    for (const [index, filter] of quickFilters.filters.entries()) {
      const brackets = this.getBracketsForQuickFilters(
        filter,
        fieldsToFilter,
        `quickFilterParam${index}`,
        queryBuilder.alias,
      );

      if (quickFilters.operator === FilterOperator.AND) {
        queryBuilder.andWhere(brackets);
      } else if (quickFilters.operator === FilterOperator.OR) {
        queryBuilder.orWhere(brackets);
      }
    }
  }

  private getBracketsForQuickFilters(
    filter: string,
    fieldsToFilter: string[],
    paramName: string,
    queryAlias: string,
  ): Brackets {
    return new Brackets((qb) => {
      const paramValue = `%${filter}%`;
      fieldsToFilter.forEach((field, idx) => {
        const column = `${queryAlias}.${String(field)}`;
        const clause = `${column} LIKE :${paramName}`;
        const params = { [paramName]: paramValue };

        if (idx === 0) {
          qb.where(clause, params);
        } else {
          qb.orWhere(clause, params);
        }
      });
    });
  }
}
