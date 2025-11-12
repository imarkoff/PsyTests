import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDoctorPatientsByDoctorIdAndPatientIdsQuery } from './get-doctor-patients-by-doctor-id-and-patient-ids.query';
import { DoctorPatientsRepository } from '../../../domain/interfaces/doctor-patients.repository';
import { DoctorPatientDto } from '../../../presentation/dtos/doctor-patient.dto';
import { DoctorPatientMapper } from '../../mappers/doctor-patient.mapper';

@QueryHandler(GetDoctorPatientsByDoctorIdAndPatientIdsQuery)
export class GetDoctorPatientsByDoctorIdAndPatientIdsHandler
  implements IQueryHandler<GetDoctorPatientsByDoctorIdAndPatientIdsQuery>
{
  constructor(
    private readonly doctorPatientsRepository: DoctorPatientsRepository,
  ) {}

  async execute({
    doctorId,
    patientIds,
  }: GetDoctorPatientsByDoctorIdAndPatientIdsQuery): Promise<
    DoctorPatientDto[]
  > {
    const doctorPatients =
      await this.doctorPatientsRepository.getPatientsByDoctorAndPatientsIds(
        doctorId,
        patientIds,
      );

    return doctorPatients.map((dp) => DoctorPatientMapper.toDto(dp));
  }
}
