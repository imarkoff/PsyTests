import { Command } from '@nestjs/cqrs';
import { UUID } from 'node:crypto';
import { DoctorPatientDto } from '../../../presentation/dtos/doctor-patient.dto';

export class AssignDoctorPatientCommand extends Command<DoctorPatientDto> {
  constructor(
    public readonly doctorId: UUID,
    public readonly patientId: UUID,
  ) {
    super();
  }
}
