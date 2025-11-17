import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeORMModule } from '../core/typeorm/typeorm.module';
import { AssignedTestsRepository } from './domain/interfaces/assigned-tests.repository';
import { TypeOrmAssignedTestsRepository } from './infrastructure/typeorm/typeorm-assigned-tests.repository';
import { DoctorPatientsAssignedTestsController } from './presentation/doctor-patients-assigned-tests.controller';
import { PatientAssignedTestsController } from './presentation/patient-assigned-tests.controller';
import { DoctorPatientsAssignedTestsOrchestrator } from './application/services/doctor-patients-assigned-tests-orchestrator/doctor-patients-assigned-tests-orchestrator.asbtract';
import { DoctorPatientsAssignedTestsOrchestratorImpl } from './application/services/doctor-patients-assigned-tests-orchestrator/doctor-patients-assigned-tests-orchestrator.impl';
import { AssignTestToPatientHandler } from './application/commands/assign-test-to-patient/assign-test-to-patient.handler';
import { GetAssignedTestsByPatientIdHandler } from './application/queries/get-assigned-tests-by-patient-id/get-assigned-tests-by-patient-id.handler';
import { UnassignTestHandler } from './application/commands/unassign-test/unassign-test.handler';
import { PatientAssignedTestsOrchestrator } from './application/services/patient-assigned-tests-orchestrator/patient-assigned-tests-orchestrator.abstract';
import { PatientAssignedTestsOrchestratorImpl } from './application/services/patient-assigned-tests-orchestrator/patient-assigned-tests-orchestrator.impl';

@Module({
  imports: [CqrsModule, TypeORMModule],
  controllers: [
    DoctorPatientsAssignedTestsController,
    PatientAssignedTestsController,
  ],
  providers: [
    {
      provide: AssignedTestsRepository,
      useClass: TypeOrmAssignedTestsRepository,
    },
    {
      provide: DoctorPatientsAssignedTestsOrchestrator,
      useClass: DoctorPatientsAssignedTestsOrchestratorImpl,
    },
    {
      provide: PatientAssignedTestsOrchestrator,
      useClass: PatientAssignedTestsOrchestratorImpl,
    },
    AssignTestToPatientHandler,
    UnassignTestHandler,
    GetAssignedTestsByPatientIdHandler,
  ],
})
export class AssignedTestsModule {}
