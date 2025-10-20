import { FilterOperator } from '../enums/filter-operator.enum';
import { QuickFilter } from '../types/pagination-params.type';
import {
  PrismaModelKey,
  PrismaModelOperations,
} from '../../../core/prisma/prisma-model-operations.type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaQuickFilterApplier {
  applyQuickFilter<TPrismaModel extends PrismaModelKey, T extends object>(
    quickFilter: QuickFilter | undefined,
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

      const fieldFilters = searchableFields.map((field) => ({
        [operator]: quickFilter.filters.map((filter) => ({
          [field]: {
            contains: filter,
            mode: 'insensitive',
          },
        })),
      }));

      return {
        [operator]: fieldFilters,
      };
    }

    return {};
  }
}
