import {
  EntityTarget,
  FindOptionsRelations,
  SelectQueryBuilder,
} from 'typeorm';

export class TypeOrmRelationsApplier {
  applyRelations<TModel extends object>(
    model: EntityTarget<TModel>,
    queryBuilder: SelectQueryBuilder<TModel>,
    include: FindOptionsRelations<TModel>,
  ): void {
    Object.entries(include).forEach(([relation]) => {
      queryBuilder.leftJoinAndSelect(
        `${model.constructor.name}.${relation}`,
        relation,
      );
    });
  }
}
