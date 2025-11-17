import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeORMModule } from '../core/typeorm/typeorm.module';
import { AssignedTestsRepository } from './domain/interfaces/assigned-tests.repository';
import { TypeOrmAssignedTestsRepository } from './infrastructure/typeorm/typeorm-assigned-tests.repository';
import { AssignTestToPatientHandler } from './application/commands/assign-test-to-patient/assign-test-to-patient.handler';
import { GetAssignedTestsByPatientIdHandler } from './application/queries/get-assigned-tests-by-patient-id/get-assigned-tests-by-patient-id.handler';
import { UnassignTestHandler } from './application/commands/unassign-test/unassign-test.handler';

@Module({
  imports: [CqrsModule, TypeORMModule],
  controllers: [],
  providers: [
    {
      provide: AssignedTestsRepository,
      useClass: TypeOrmAssignedTestsRepository,
    },
    AssignTestToPatientHandler,
    UnassignTestHandler,
    GetAssignedTestsByPatientIdHandler,
  ],
})
export class AssignedTestsModule {}
