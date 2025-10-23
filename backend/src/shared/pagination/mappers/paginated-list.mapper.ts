import { PaginationParams } from '../types/pagination-params.type';
import { DbPaginated } from '../types/db-paginated.type';
import { PaginatedList } from '../types/paginated-list.type';

export class PaginatedListMapper {
  static toDto<TDto extends object, TModel extends object>(
    paginationParams: PaginationParams<TModel>,
    dbPaginated: DbPaginated<TModel>,
    convertModel: (model: TModel) => TDto,
  ): PaginatedList<TDto> {
    return {
      ...(paginationParams as unknown as PaginationParams<TDto>),
      items: dbPaginated.items.map(convertModel),
      totalCount: dbPaginated.totalCount,
      totalPages: Math.ceil(dbPaginated.totalCount / paginationParams.pageSize),
      hasNextPage:
        paginationParams.page * paginationParams.pageSize <
        dbPaginated.totalCount,
      hasPreviousPage: paginationParams.page > 1,
    };
  }
}
