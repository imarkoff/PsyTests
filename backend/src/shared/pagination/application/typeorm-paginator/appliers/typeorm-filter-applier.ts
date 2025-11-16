import { SelectQueryBuilder } from 'typeorm';
import { Filters } from '../../../domain/types/pagination-params.type';

export class TypeOrmFilterApplier {
  applyFilters<TModel extends object>(
    queryBuilder: SelectQueryBuilder<TModel>,
    paginationFilters: Filters<TModel> | null,
  ): void {
    if (!paginationFilters) {
      return;
    }

    throw new Error('TypeOrmFilterApplier.applyFilters not implemented yet.');

    // Object.entries(paginationFilters.filters).forEach(
    //   ([field, operator, value]) => {
    //
    //   }
    // );
  }
}
