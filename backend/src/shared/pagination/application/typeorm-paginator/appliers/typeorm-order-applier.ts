import { SortedField } from '../../../domain/types/pagination-params.type';
import { SelectQueryBuilder } from 'typeorm';

export class TypeOrmOrderApplier {
  applyOrder<TModel extends object>(
    queryBuilder: SelectQueryBuilder<TModel>,
    sortedFields: SortedField<TModel>[],
  ): void {
    for (const [index, field] of sortedFields.entries()) {
      if (index === 0) {
        queryBuilder.orderBy(
          `${queryBuilder.alias}.${String(field.field)}`,
          field.direction,
        );
      } else {
        queryBuilder.addOrderBy(
          `${queryBuilder.alias}.${String(field.field)}`,
          field.direction,
        );
      }
    }
  }
}
