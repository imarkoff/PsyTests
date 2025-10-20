import { FilterOperator } from '../enums/filter-operator.enum';
import { Filter } from '../types/pagination-params.type';
import {
  PrismaModelKey,
  PrismaModelOperations,
} from '../../../core/prisma/prisma-model-operations.type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaFilterApplier {
  applyFilters<TPrismaModel extends PrismaModelKey, T extends object>(
    filter: Filter<T> | undefined,
    filterFields: (keyof T)[],
  ):
    | PrismaModelOperations<TPrismaModel>['whereClause']['AND']
    | PrismaModelOperations<TPrismaModel>['whereClause']['OR'] {
    if (filter && filterFields.length > 0) {
      const operator = filter.operator || FilterOperator.AND;

      const filterConditions = filter.filters
        .filter((f) => filterFields.includes(f.field))
        .map((f) => ({
          [f.field]: { [this.mapOperator(f.operator)]: f.value },
        }));

      return {
        [operator]: filterConditions,
      };
    }

    return {};
  }

  private mapOperator(operator: string): string {
    // Map custom operators to Prisma operators (extend as needed)
    const operatorMap: Record<string, string> = {
      eq: 'equals',
      ne: 'not',
      gt: 'gt',
      gte: 'gte',
      lt: 'lt',
      lte: 'lte',
      contains: 'contains',
      // Add more as per your needs
    };
    return operatorMap[operator] || 'equals';
  }
}
