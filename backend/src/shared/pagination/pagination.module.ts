import { Global, Module } from '@nestjs/common';
import { TypeOrmPaginator } from './application/typeorm-paginator/typeorm-paginator.abstract';
import { TypeOrmPaginatorImpl } from './application/typeorm-paginator/typeorm-paginator.impl';
import { TypeOrmQuickFilterApplier } from './application/typeorm-paginator/appliers/typeorm-quick-filter-applier';
import { TypeOrmFilterApplier } from './application/typeorm-paginator/appliers/typeorm-filter-applier';
import { TypeOrmOrderApplier } from './application/typeorm-paginator/appliers/typeorm-order-applier';
import { TypeOrmRelationsApplier } from './application/typeorm-paginator/appliers/typeorm-relations-applier';
import { TypeORMModule } from '../../core/typeorm/typeorm.module';

@Global()
@Module({
  imports: [TypeORMModule],
  providers: [
    {
      provide: TypeOrmPaginator,
      useClass: TypeOrmPaginatorImpl,
    },
    TypeOrmQuickFilterApplier,
    TypeOrmFilterApplier,
    TypeOrmOrderApplier,
    TypeOrmRelationsApplier,
  ],
  exports: [TypeOrmPaginator],
})
export class PaginationModule {}
