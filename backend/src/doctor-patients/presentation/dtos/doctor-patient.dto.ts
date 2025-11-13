import type { UUID } from 'node:crypto';
import { UserDto } from '../../../users/presentation/dtos/user.dto';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  description:
    'Data Transfer Object representing the association between a doctor and a patient.',
})
export class DoctorPatientDto {
  /** Unique identifier for the doctor-patient association */
  @ApiProperty({ format: 'uuid' })
  id: UUID;

  /** Unique identifier for the doctor */
  @ApiProperty({ format: 'uuid' })
  doctorId: UUID;

  /**
   * Details of the doctor.
   * May be null if doctors were not included in the query.
   */
  @ApiProperty({ type: () => UserDto, nullable: true })
  doctor: UserDto | null;

  /** Unique identifier for the patient */
  @ApiProperty({ format: 'uuid' })
  patientId: UUID;

  /**
   * Details of the patient.
   * May be null if patients were not included in the query.
   */
  @ApiProperty({ type: () => UserDto, nullable: true })
  patient: UserDto | null;

  /** Timestamp when the doctor was assigned to the patient */
  @ApiProperty({ format: 'date-time' })
  assignedAt: Date;

  /** Timestamp when the doctor was unassigned from the patient */
  @ApiProperty({ format: 'date-time', nullable: true })
  unassignedAt: Date | null;

  /** Indicates if the patient needs attention from the doctor */
  @ApiProperty()
  needsAttention: boolean;

  /** Timestamp when the association was deleted, if applicable */
  @ApiProperty({ format: 'date-time', nullable: true })
  deletedAt: Date | null;
}
