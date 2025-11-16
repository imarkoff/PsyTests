import { FindOptionsRelations, SelectQueryBuilder } from 'typeorm';

export class TypeOrmRelationsApplier {
  applyRelations<TModel extends object>(
    queryBuilder: SelectQueryBuilder<TModel>,
    include: FindOptionsRelations<TModel>,
  ): void {
    Object.entries(include).forEach(([relation, value]) => {
      if (value) {
        queryBuilder.leftJoinAndSelect(
          `${queryBuilder.alias}.${relation}`,
          relation,
        );
      }
    });
  }
}
