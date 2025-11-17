import { Query } from '@nestjs/cqrs';
import { DoctorPatientDto } from '../../../presentation/dtos/doctor-patient.dto';
import { UUID } from 'node:crypto';

export class GetAssignedDoctorPatientByDoctorIdAndPatientIdQuery extends Query<DoctorPatientDto | null> {
  constructor(
    public readonly doctorId: UUID,
    public readonly patientId: UUID,
  ) {
    super();
  }
}
