import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAssignedDoctorPatientByDoctorIdAndPatientIdQuery } from './get-assigned-doctor-patient-by-doctor-id-and-patient-id.query';
import { DoctorPatientDto } from '../../../presentation/dtos/doctor-patient.dto';
import { DoctorPatientsRepository } from '../../../domain/interfaces/doctor-patients.repository';
import { DoctorPatientMapper } from '../../mappers/doctor-patient.mapper';
import { Logger } from '@nestjs/common';

@QueryHandler(GetAssignedDoctorPatientByDoctorIdAndPatientIdQuery)
export class GetAssignedDoctorPatientByDoctorIdAndPatientIdHandler
  implements IQueryHandler<GetAssignedDoctorPatientByDoctorIdAndPatientIdQuery>
{
  private readonly logger = new Logger(
    GetAssignedDoctorPatientByDoctorIdAndPatientIdHandler.name,
  );

  constructor(private readonly repository: DoctorPatientsRepository) {}

  async execute({
    doctorId,
    patientId,
  }: GetAssignedDoctorPatientByDoctorIdAndPatientIdQuery): Promise<DoctorPatientDto | null> {
    this.logger.debug(
      `Getting assigned doctor-patient relation for doctorId: ${doctorId} and patientId: ${patientId}`,
    );
    const entity = await this.repository.getAssignedPatientByDoctorAndPatientId(
      doctorId,
      patientId,
    );

    if (!entity) {
      this.logger.debug(
        `No assigned doctor-patient relation found for doctorId: ${doctorId} and patientId: ${patientId}`,
      );
      return null;
    }

    this.logger.debug(
      `Found assigned doctor-patient relation for doctorId: ${doctorId} and patientId: ${patientId}`,
    );
    return DoctorPatientMapper.toDto(entity);
  }
}
