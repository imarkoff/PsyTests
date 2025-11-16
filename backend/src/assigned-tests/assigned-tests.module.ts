import { Module } from '@nestjs/common';
import { AssignedTestsRepository } from './domain/interfaces/assigned-tests.repository';
import { TypeOrmAssignedTestsRepository } from './infrastructure/typeorm/typeorm-assigned-tests.repository';
import { TypeORMModule } from '../core/typeorm/typeorm.module';

@Module({
  imports: [TypeORMModule],
  controllers: [],
  providers: [
    {
      provide: AssignedTestsRepository,
      useClass: TypeOrmAssignedTestsRepository,
    },
  ],
})
export class AssignedTestsModule {}
