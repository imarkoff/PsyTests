import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypeOrmQuickFilterApplier } from './appliers/typeorm-quick-filter-applier';
import { TypeOrmFilterApplier } from './appliers/typeorm-filter-applier';
import { TypeOrmOrderApplier } from './appliers/typeorm-order-applier';
import { DbPaginated } from '../../domain/types/db-paginated.type';
import { TypeOrmRelationsApplier } from './appliers/typeorm-relations-applier';
import { PaginateProps, TypeOrmPaginator } from './typeorm-paginator.abstract';

@Injectable()
export class TypeOrmPaginatorImpl implements TypeOrmPaginator {
  constructor(
    private readonly dataSource: DataSource,
    private readonly filterApplier: TypeOrmFilterApplier,
    private readonly quickFilterApplier: TypeOrmQuickFilterApplier,
    private readonly orderApplier: TypeOrmOrderApplier,
    private readonly relationsApplier: TypeOrmRelationsApplier,
  ) {}

  async paginate<TModel extends object>({
    model,
    paginationParams,
    where = {},
    filterFields = [],
    include = {},
  }: PaginateProps<TModel>): Promise<DbPaginated<TModel>> {
    const queryBuilder = this.getBuilder(model);

    queryBuilder.where(where);

    this.quickFilterApplier.applyQuickFilter(
      filterFields,
      queryBuilder,
      paginationParams.quickFilters,
    );
    this.filterApplier.applyFilters(queryBuilder, paginationParams.filters);
    this.relationsApplier.applyRelations(model, queryBuilder, include);

    const totalItems = await queryBuilder.getCount();

    this.orderApplier.applyOrder(queryBuilder, paginationParams.sortedFields);

    queryBuilder.skip(paginationParams.page * paginationParams.pageSize);
    queryBuilder.take(paginationParams.pageSize);

    const items = await queryBuilder.getMany();

    return {
      items,
      totalCount: totalItems,
    };
  }
  private getBuilder<TModel extends object>(model: TModel) {
    const repository = this.dataSource.getRepository<TModel>(
      model.constructor.name,
    );
    const alias =
      repository.metadata.targetName || repository.metadata.name || 't';
    return repository.createQueryBuilder(alias);
  }
}
