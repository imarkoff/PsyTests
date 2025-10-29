import { type UUID } from 'crypto';
import { UserRole } from '../../../shared/enums/user-role.enum';
import { UserGender } from '../../../shared/enums/user-gender.enum';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ description: 'Data Transfer Object representing a user' })
export class UserDto {
  /** User's unique identifier */
  @ApiProperty({ format: 'uuid' })
  id: UUID;

  /** First name of the user */
  @ApiProperty()
  name: string;

  /** Surname of the user */
  @ApiProperty()
  surname: string;

  /** Patronymic (middle name) of the user, if applicable */
  @ApiProperty({ required: false })
  patronymic: string | null = null;

  /** Gender of the user */
  @ApiProperty({ enum: UserGender })
  gender: UserGender;

  /** Date of birth of the user */
  @ApiProperty({ type: 'string', format: 'date-time' })
  birthDate: Date;

  /** Phone number in E.164 format */
  @ApiProperty()
  phone: string;

  /** Role of the user within the system */
  @ApiProperty({ enum: UserRole })
  role: UserRole;

  /** Date and time when the user registered */
  @ApiProperty({ type: 'string', format: 'date-time' })
  registeredAt: Date;

  /** UUID of the user who registered this user, if applicable */
  @ApiProperty({ required: false })
  registeredBy: UUID | null = null;

  /** Date and time of the user's last login */
  @ApiProperty({ required: false })
  lastLoginAt: Date | null = null;
}
