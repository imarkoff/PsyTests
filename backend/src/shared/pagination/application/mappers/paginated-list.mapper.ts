import { PaginationParams } from '../../domain/types/pagination-params.type';
import { DbPaginated } from '../../domain/types/db-paginated.type';
import { PaginatedList } from '../../domain/types/paginated-list.type';

export class PaginatedListMapper {
  static toDto<TDto extends object, TModel extends object>(
    paginationParams: PaginationParams<TModel>,
    dbPaginated: DbPaginated<TModel>,
    convertModel: (model: TModel) => TDto,
  ): PaginatedList<TDto, TModel> {
    return {
      ...paginationParams,
      items: dbPaginated.items.map(convertModel),
      totalCount: dbPaginated.totalCount,
      totalPages: Math.ceil(dbPaginated.totalCount / paginationParams.pageSize),
      hasNextPage:
        (paginationParams.page + 1) * paginationParams.pageSize <
        dbPaginated.totalCount,
      hasPreviousPage: paginationParams.page > 0,
    };
  }
}
