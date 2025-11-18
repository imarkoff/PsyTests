import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeORMModule } from '../core/typeorm/typeorm.module';
import { AssignedTestsRepository } from './domain/interfaces/assigned-tests.repository';
import { TypeOrmAssignedTestsRepository } from './infrastructure/typeorm/typeorm-assigned-tests.repository';
import { DoctorPatientsAssignedTestsController } from './presentation/doctor-patients-assigned-tests.controller';
import { PatientAssignedTestsController } from './presentation/patient-assigned-tests.controller';
import { PatientTestResultsController } from './presentation/patient-test-results.controller';
import { DoctorPatientsAssignedTestsOrchestrator } from './application/services/doctor-patients-assigned-tests-orchestrator/doctor-patients-assigned-tests-orchestrator.asbtract';
import { DoctorPatientsAssignedTestsOrchestratorImpl } from './application/services/doctor-patients-assigned-tests-orchestrator/doctor-patients-assigned-tests-orchestrator.impl';
import { AssignTestToPatientHandler } from './application/commands/assign-test-to-patient/assign-test-to-patient.handler';
import { GetAssignedTestsByPatientIdHandler } from './application/queries/get-assigned-tests-by-patient-id/get-assigned-tests-by-patient-id.handler';
import { UnassignTestHandler } from './application/commands/unassign-test/unassign-test.handler';
import { PatientAssignedTestsOrchestrator } from './application/services/patient-assigned-tests-orchestrator/patient-assigned-tests-orchestrator.abstract';
import { PatientAssignedTestsOrchestratorImpl } from './application/services/patient-assigned-tests-orchestrator/patient-assigned-tests-orchestrator.impl';
import { TestResultsRepository } from './domain/interfaces/test-results.repository';
import { TypeOrmTestResultsRepository } from './infrastructure/typeorm/typeorm-test-results.repository';
import { GetAssignedTestByTestIdAndPatientIdHandler } from './application/queries/get-assigned-test-by-test-id-and-patient-id/get-assigned-test-by-test-id-and-patient-id.handler';
import { PassAssignedTestHandler } from './application/commands/pass-assigned-test/pass-assigned-test.handler';
import { PatientTestResultsOrchestrator } from './application/services/patient-test-results-orchestrator/patient-test-results-orchestrator.abstract';
import { PatientTestResultsOrchestratorImpl } from './application/services/patient-test-results-orchestrator/patient-test-results-orchestrator.impl';
import { GetShortTestResultsByPatientIdHandler } from './application/queries/get-short-test-results-by-patient-id/get-short-test-results-by-patient-id.handler';

@Module({
  imports: [CqrsModule, TypeORMModule],
  controllers: [
    DoctorPatientsAssignedTestsController,
    PatientAssignedTestsController,
    PatientTestResultsController,
  ],
  providers: [
    {
      provide: AssignedTestsRepository,
      useClass: TypeOrmAssignedTestsRepository,
    },
    {
      provide: TestResultsRepository,
      useClass: TypeOrmTestResultsRepository,
    },
    {
      provide: DoctorPatientsAssignedTestsOrchestrator,
      useClass: DoctorPatientsAssignedTestsOrchestratorImpl,
    },
    {
      provide: PatientAssignedTestsOrchestrator,
      useClass: PatientAssignedTestsOrchestratorImpl,
    },
    {
      provide: PatientTestResultsOrchestrator,
      useClass: PatientTestResultsOrchestratorImpl,
    },
    AssignTestToPatientHandler,
    PassAssignedTestHandler,
    UnassignTestHandler,
    GetAssignedTestByTestIdAndPatientIdHandler,
    GetAssignedTestsByPatientIdHandler,
    GetShortTestResultsByPatientIdHandler,
  ],
})
export class AssignedTestsModule {}
