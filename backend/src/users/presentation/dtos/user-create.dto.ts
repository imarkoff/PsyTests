import { UserGender } from '../../../shared/enums/user-gender.enum';
import { UserRole } from '../../../shared/enums/user-role.enum';
import {
  IsDate,
  IsEnum,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsPasswordValid } from '../../../core/decorators/is-password-valid.decorator';

export class UserCreateDto {
  @IsString()
  @MaxLength(100, { message: 'Name must be at most 100 characters long.' })
  name: string;

  @IsString()
  @MaxLength(100, { message: 'Surname must be at most 100 characters long.' })
  surname: string;

  @IsString()
  @MaxLength(100, {
    message: 'Patronymic must be at most 100 characters long.',
  })
  patronymic: string | null;

  @IsEnum(UserGender)
  gender: UserGender;

  @IsDate({
    message: 'Birth date must be a valid date string.',
  })
  birthDate: Date;

  @IsPhoneNumber(undefined, {
    message: 'Phone number must start with a + and contain only digits.',
  })
  phone: string;

  @IsPasswordValid()
  password: string;

  @IsEnum(UserRole, { message: 'Role must be a valid user role.' })
  role: UserRole | null;
}
