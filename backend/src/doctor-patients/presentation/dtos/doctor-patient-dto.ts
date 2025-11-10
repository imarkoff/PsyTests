import { UUID } from 'node:crypto';
import { UserDto } from '../../../users/presentation/dtos/user.dto';

export class DoctorPatientDto {
  id: UUID;
  doctorId: UUID;
  doctor: UserDto | null;
  patientId: UUID;
  patient: UserDto | null;
  assignedAt: Date;
  unassignedAt: Date | null;
  needsAttention: boolean;
  deletedAt: Date | null;
}
