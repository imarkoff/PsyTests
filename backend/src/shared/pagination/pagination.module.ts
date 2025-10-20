import { Global, Module } from '@nestjs/common';
import { PrismaPaginator } from './prisma-applier/prisma-paginator.service';
import { PrismaFilterApplier } from './prisma-applier/prisma-filter-applier.service';
import { PrismaOrderApplier } from './prisma-applier/prisma-order-applier.service';
import { PrismaQuickFilterApplier } from './prisma-applier/prisma-quick-filter-applier.service';

@Global()
@Module({
  providers: [
    PrismaFilterApplier,
    PrismaOrderApplier,
    PrismaQuickFilterApplier,
    PrismaPaginator,
  ],
  exports: [PrismaPaginator],
})
export class PaginationModule {}
