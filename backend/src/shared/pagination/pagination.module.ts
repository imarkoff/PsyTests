import { Global, Module } from '@nestjs/common';
import { PrismaPaginator } from './prisma-applier/prisma-paginator.service';
import { PrismaFilterApplier } from './prisma-applier/prisma-filter-applier.service';
import { PrismaOrderApplier } from './prisma-applier/prisma-order-applier.service';
import { PrismaQuickFilterApplier } from './prisma-applier/prisma-quick-filter-applier.service';
import { TypeOrmPaginator } from './typeorm-paginator/typeorm-paginator.abstract';
import { TypeOrmPaginatorImpl } from './typeorm-paginator/typeorm-paginator.impl';
import { TypeOrmQuickFilterApplier } from './typeorm-paginator/appliers/typeorm-quick-filter-applier';
import { TypeOrmFilterApplier } from './typeorm-paginator/appliers/typeorm-filter-applier';
import { TypeOrmOrderApplier } from './typeorm-paginator/appliers/typeorm-order-applier';
import { TypeOrmRelationsApplier } from './typeorm-paginator/appliers/typeorm-relations-applier';
import { TypeORMModule } from '../../core/typeorm/typeorm.module';

@Global()
@Module({
  imports: [TypeORMModule],
  providers: [
    PrismaFilterApplier,
    PrismaOrderApplier,
    PrismaQuickFilterApplier,
    PrismaPaginator,
    {
      provide: TypeOrmPaginator,
      useClass: TypeOrmPaginatorImpl,
    },
    TypeOrmQuickFilterApplier,
    TypeOrmFilterApplier,
    TypeOrmOrderApplier,
    TypeOrmRelationsApplier,
  ],
  exports: [PrismaPaginator],
})
export class PaginationModule {}
