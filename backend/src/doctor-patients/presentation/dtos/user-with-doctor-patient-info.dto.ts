import { UserDto } from '../../../users/presentation/dtos/user.dto';
import { DoctorPatientDto } from './doctor-patient.dto';
import { ApiExtraModels, ApiProperty, ApiSchema } from '@nestjs/swagger';
import type { UUID } from 'node:crypto';

@ApiSchema({
  description:
    'DTO representing essential information about the Doctor-Patient relationship',
})
export class DoctorPatientInfoDto
  implements Pick<DoctorPatientDto, 'id' | 'assignedAt' | 'needsAttention'>
{
  @ApiProperty({
    description: 'Unique identifier of the doctor-patient record',
    format: 'uuid',
  })
  id: UUID;

  @ApiProperty({
    description: 'Date when the patient was assigned to the doctor',
    type: String,
    format: 'date-time',
  })
  assignedAt: Date;

  @ApiProperty({
    description:
      'Indicates whether the patient needs special attention from the doctor',
  })
  needsAttention: boolean;
}

@ApiSchema({
  description: 'User DTO extended with Doctor-Patient relationship information',
})
@ApiExtraModels(DoctorPatientInfoDto)
export class UserWithDoctorPatientInfoDto extends UserDto {
  @ApiProperty({
    description:
      'Information about the doctor-patient relationship, if it exists',
    type: DoctorPatientInfoDto,
    nullable: true,
  })
  doctorPatientInfo: DoctorPatientInfoDto | null;
}
