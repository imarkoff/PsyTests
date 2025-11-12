import { UserDto } from '../../../users/presentation/dtos/user.dto';
import { DoctorPatientDto } from './doctor-patient.dto';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  description: 'User DTO extended with Doctor-Patient relationship information',
})
export class UserWithDoctorPatientInfoDto extends UserDto {
  @ApiProperty({
    description:
      'Information about the doctor-patient relationship, if it exists',
    nullable: true,
  })
  doctorPatientInfo: Pick<
    DoctorPatientDto,
    'id' | 'assignedAt' | 'needsAttention'
  > | null;
}
