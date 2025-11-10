import { Module } from '@nestjs/common';
import { DoctorPatientsRepository } from './domain/interfaces/doctor-patients.repository';
import { PrismaDoctorPatientsRepository } from './infrastructure/prisma/prisma-doctor-patients.repository';

@Module({
  providers: [
    {
      provide: DoctorPatientsRepository,
      useClass: PrismaDoctorPatientsRepository,
    },
  ],
  exports: [],
})
export class DoctorPatientsModule {}
