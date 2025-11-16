import { PaginationParams } from '../types/pagination-params.type';
import { FindManyOptions, FindOptionsRelations } from 'typeorm';
import { DbPaginated } from '../types/db-paginated.type';

/**
 * Paginates data from a TypeORM data source based on the provided pagination parameters.
 */
export abstract class TypeOrmPaginator {
  /**
   * Paginates data based on the provided properties.
   * @param props - The properties required for pagination.
   * @returns A promise that resolves to a paginated result set.
   */
  abstract paginate<TModel extends object>(
    props: PaginateProps<TModel>,
  ): Promise<DbPaginated<TModel>>;
}

export interface PaginateProps<TModel extends object> {
  /** The model (entity) to paginate. */
  model: TModel;

  /** The pagination parameters to apply. */
  paginationParams: PaginationParams<TModel>;

  /** Optional filtering conditions. */
  where?: FindManyOptions<TModel>['where'];

  /** Optional relations to include in the query. */
  include?: FindOptionsRelations<TModel>;

  /** Optional fields to apply filtering on. */
  filterFields?: string[];
}
