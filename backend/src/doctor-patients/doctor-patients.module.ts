import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DoctorPatientsRepository } from './domain/interfaces/doctor-patients.repository';
import { DoctorPatientsController } from './presentation/doctor-patients.controller';
import { AssignDoctorPatientHandler } from './application/commands/assign-doctor-patient/assign-doctor-patient.handler';
import { GetPatientsByDoctorIdHandler } from './application/queries/get-patients-by-doctor-id/get-patients-by-doctor-id.handler';
import { DoctorPatientCreator } from './application/services/doctor-patient-creator/doctor-patient-creator.abstract';
import { DoctorPatientCreatorImpl } from './application/services/doctor-patient-creator/doctor-patient-creator.impl';
import { MarkDoctorPatientAsReadHandler } from './application/commands/mark-doctor-patient-as-read/mark-doctor-patient-as-read.handler';
import { UnassignDoctorPatientHandler } from './application/commands/unassign-doctor-patient/unassign-doctor-patient.handler';
import { GetPatientByIdAndDoctorIdHandler } from './application/queries/get-patient-by-id-and-doctor-id/get-patient-by-id-and-doctor-id.handler';
import { DoctorPatientOrchestrator } from './application/services/doctor-patient-orchestrator/doctor-patient-orchestrator.abstract';
import { DoctorPatientOrchestratorImpl } from './application/services/doctor-patient-orchestrator/doctor-patient-orchestrator.impl';
import { DoctorPatientRemover } from './application/services/doctor-patient-remover/doctor-patient-remover.abstract';
import { DoctorPatientRemoverImpl } from './application/services/doctor-patient-remover/doctor-patient-remover.impl';
import { PatientsFinder } from './application/services/patients-finder/patients-finder.abstract';
import { PatientsFinderImpl } from './application/services/patients-finder/patients-finder.impl';
import { GetDoctorPatientsByDoctorIdAndPatientIdsHandler } from './application/queries/get-doctor-patients-by-doctor-id-and-patient-ids/get-doctor-patients-by-doctor-id-and-patient-ids.handler';
import { TypeOrmDoctorPatientsRepository } from './infrastructure/typeorm/typeorm-doctor-patients.repository';
import { TypeORMModule } from '../core/typeorm/typeorm.module';

@Module({
  imports: [CqrsModule, TypeORMModule],
  controllers: [DoctorPatientsController],
  providers: [
    {
      provide: DoctorPatientsRepository,
      useClass: TypeOrmDoctorPatientsRepository,
    },
    {
      provide: DoctorPatientCreator,
      useClass: DoctorPatientCreatorImpl,
    },
    {
      provide: DoctorPatientOrchestrator,
      useClass: DoctorPatientOrchestratorImpl,
    },
    {
      provide: DoctorPatientRemover,
      useClass: DoctorPatientRemoverImpl,
    },
    {
      provide: PatientsFinder,
      useClass: PatientsFinderImpl,
    },
    AssignDoctorPatientHandler,
    MarkDoctorPatientAsReadHandler,
    UnassignDoctorPatientHandler,
    GetDoctorPatientsByDoctorIdAndPatientIdsHandler,
    GetPatientByIdAndDoctorIdHandler,
    GetPatientsByDoctorIdHandler,
  ],
  exports: [],
})
export class DoctorPatientsModule {}
