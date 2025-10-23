import { type UUID } from 'crypto';
import { UserRole } from '../../../shared/enums/user-role.enum';
import { UserGender } from '../../../shared/enums/user-gender.enum';

export interface UserDto {
  id: UUID;
  name: string;
  surname: string;
  patronymic: string | null;
  gender: UserGender;
  birthDate: Date;
  phone: string;
  role: UserRole;
  registeredAt: Date;
  registeredBy: UUID | null;
  lastLoginAt: Date | null;
}
