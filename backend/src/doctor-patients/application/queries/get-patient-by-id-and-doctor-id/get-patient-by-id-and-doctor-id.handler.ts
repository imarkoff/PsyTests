import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPatientByIdAndDoctorIdQuery } from './get-patient-by-id-and-doctor-id.query';
import { DoctorPatientDto } from 'src/doctor-patients/presentation/dtos/doctor-patient.dto';
import { DoctorPatientsRepository } from '../../../domain/interfaces/doctor-patients.repository';
import { DoctorPatientMapper } from '../../mappers/doctor-patient.mapper';

@QueryHandler(GetPatientByIdAndDoctorIdQuery)
export class GetPatientByIdAndDoctorIdHandler
  implements IQueryHandler<GetPatientByIdAndDoctorIdQuery>
{
  constructor(
    private readonly doctorPatientsRepository: DoctorPatientsRepository,
  ) {}

  async execute({
    doctorId,
    patientId,
  }: GetPatientByIdAndDoctorIdQuery): Promise<DoctorPatientDto | null> {
    const doctorPatient =
      await this.doctorPatientsRepository.getPatientByDoctorAndPatientId(
        doctorId,
        patientId,
      );

    if (!doctorPatient) {
      return null;
    }

    return DoctorPatientMapper.toDto(doctorPatient);
  }
}
