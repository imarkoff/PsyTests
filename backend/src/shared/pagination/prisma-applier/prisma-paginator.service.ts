import { PaginationParams } from '../types/pagination-params.type';
import { PaginatedList } from '../types/paginated-list.type';
import {
  PrismaModelKey,
  PrismaModelOperations,
} from '../../../core/prisma/prisma-model-operations.type';
import { PrismaFilterApplier } from './prisma-filter-applier.service';
import { PrismaQuickFilterApplier } from './prisma-quick-filter-applier.service';
import { PrismaOrderApplier } from './prisma-order-applier.service';
import { Injectable } from '@nestjs/common';

type FindManyFunction<
  TPrismaModel extends PrismaModelKey,
  TModel extends object,
> = (args: {
  where: PrismaModelOperations<TPrismaModel>['findMany']['where'];
  orderBy: PrismaModelOperations<TPrismaModel>['findMany']['orderBy'];
  skip: number;
  take: number;
  include?: PrismaModelOperations<TPrismaModel>['findMany']['include'];
}) => Promise<TModel[]>;

type CountFunction<TPrismaModel extends PrismaModelKey> = (args: {
  where: PrismaModelOperations<TPrismaModel>['count']['where'];
}) => Promise<number>;

@Injectable()
export class PrismaPaginator {
  constructor(
    private readonly orderApplier: PrismaOrderApplier,
    private readonly filterApplier: PrismaFilterApplier,
    private readonly quickFilterApplier: PrismaQuickFilterApplier,
  ) {}

  async applyPagination<
    TPrismaModel extends PrismaModelKey,
    TModel extends object,
  >(
    findMany: FindManyFunction<TPrismaModel, TModel>,
    count: CountFunction<TPrismaModel>,
    paginationParams: PaginationParams<TModel>,
    filterFields: (keyof TModel)[] = [],
    whereClause: PrismaModelOperations<TPrismaModel>['whereClause'] = {},
    include?: PrismaModelOperations<TPrismaModel>['findMany']['include'],
  ): Promise<PaginatedList<TModel>> {
    const orderBy = this.orderApplier.applyOrder(paginationParams.sortedFields);

    const where: PrismaModelOperations<TPrismaModel>['whereClause'] = {
      ...whereClause,
      ...this.quickFilterApplier.applyQuickFilter(
        paginationParams.quickFilter,
        filterFields,
      ),
      ...this.filterApplier.applyFilters(paginationParams.filter, filterFields),
    };

    const skip = (paginationParams.page - 1) * paginationParams.pageSize;
    const take = paginationParams.pageSize;

    const total = await count({ where });
    const data = await findMany({
      where,
      orderBy,
      skip,
      take,
      include,
    });

    const totalPages = Math.ceil(total / paginationParams.pageSize);
    const hasNextPage =
      paginationParams.page * paginationParams.pageSize < total;
    const hasPreviousPage = paginationParams.page > 1;

    return {
      ...paginationParams,
      items: data,
      totalCount: total,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    };
  }
}
