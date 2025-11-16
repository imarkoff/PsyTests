import { Module } from '@nestjs/common';
import { AssignedTestsRepository } from './domain/interfaces/assigned-tests.repository';
import { TypeOrmAssignedTestsRepository } from './domain/infrastructure/typeorm/typeorm-assigned-tests.repository';
import { TypeORMModule } from '../core/typeorm/typeorm.module';

@Module({
  imports: [TypeORMModule],
  controllers: [],
  providers: [
    {
      provide: AssignedTestsRepository,
      useValue: TypeOrmAssignedTestsRepository,
    },
  ],
})
export class AssignedTestsModule {}
