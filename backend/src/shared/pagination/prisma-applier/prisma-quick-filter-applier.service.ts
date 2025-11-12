import { FilterOperator } from '../enums/filter-operator.enum';
import { QuickFilters } from '../types/pagination-params.type';
import {
  PrismaModelKey,
  PrismaModelOperations,
} from '../../../core/prisma/prisma-model-operations.type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaQuickFilterApplier {
  applyQuickFilter<TPrismaModel extends PrismaModelKey, T extends object>(
    quickFilter: QuickFilters | null,
    searchableFields: (keyof T)[] = [],
  ):
    | PrismaModelOperations<TPrismaModel>['whereClause']['AND']
    | PrismaModelOperations<TPrismaModel>['whereClause']['OR'] {
    if (
      quickFilter &&
      quickFilter.filters.length > 0 &&
      searchableFields.length > 0
    ) {
      const operator = quickFilter.operator || FilterOperator.OR;

      const mappedFilters = quickFilter.filters.map((filter) => ({
        [FilterOperator.OR]: searchableFields.map((field) => ({
          [field]: {
            contains: filter,
            mode: 'insensitive',
          },
        })),
      }));

      return {
        [operator]: mappedFilters,
      };
    }

    return {};
  }
}
