import { Module } from '@nestjs/common';
import { DoctorPatientsRepository } from './domain/interfaces/doctor-patients.repository';
import { PrismaDoctorPatientsRepository } from './infrastructure/prisma/prisma-doctor-patients.repository';
import { DoctorPatientsController } from './presentation/doctor-patients.controller';
import { AssignDoctorPatientHandler } from './application/commands/assign-doctor-patient/assign-doctor-patient.handler';
import { GetPatientsByDoctorIdHandler } from './application/queries/get-patients-by-doctor-id/get-patients-by-doctor-id.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { DoctorPatientCreator } from './application/services/doctor-patient-creator/doctor-patient-creator.abstract';
import { DoctorPatientCreatorImpl } from './application/services/doctor-patient-creator/doctor-patient-creator.impl';

@Module({
  imports: [CqrsModule],
  controllers: [DoctorPatientsController],
  providers: [
    {
      provide: DoctorPatientsRepository,
      useClass: PrismaDoctorPatientsRepository,
    },
    {
      provide: DoctorPatientCreator,
      useClass: DoctorPatientCreatorImpl,
    },
    AssignDoctorPatientHandler,
    GetPatientsByDoctorIdHandler,
  ],
  exports: [],
})
export class DoctorPatientsModule {}
