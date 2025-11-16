import { SortedField } from '../../../domain/types/pagination-params.type';
import { SelectQueryBuilder } from 'typeorm';
import { PaginationException } from '../../../domain/exceptions/pagination.exception';

export class TypeOrmOrderApplier {
  applyOrder<TModel extends object>(
    queryBuilder: SelectQueryBuilder<TModel>,
    sortedFields: SortedField<TModel>[],
  ): void {
    for (const [index, field] of sortedFields.entries()) {
      this.validateField(queryBuilder, field.field as string);
      const fieldName = String(field.field);
      const orderByField = fieldName.includes('.')
        ? fieldName
        : `${queryBuilder.alias}.${fieldName}`;
      if (index === 0) {
        queryBuilder.orderBy(orderByField, field.direction);
      } else {
        queryBuilder.addOrderBy(orderByField, field.direction);
      }
    }
  }

  private validateField<TModel extends object>(
    queryBuilder: SelectQueryBuilder<TModel>,
    field: string,
  ) {
    const metadata = queryBuilder.expressionMap.mainAlias!.metadata;
    const fieldParts = field.split('.');

    if (fieldParts.length === 1) {
      if (!metadata.hasColumnWithPropertyPath(field)) {
        throw new PaginationException(`Invalid sort field: ${field}`);
      }
    } else {
      const relation = metadata.findRelationWithPropertyPath(fieldParts[0]);
      if (!relation) {
        throw new PaginationException(`Invalid relation: ${fieldParts[0]}`);
      }
    }
  }
}
