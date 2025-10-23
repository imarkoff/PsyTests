import { UserGender } from '../../../shared/enums/user-gender.enum';
import {
  IsDate,
  IsEnum,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class UserUpdateDto {
  @IsString()
  @MaxLength(100, {
    message: 'Name is too long. Maximum length is $constraint1 characters.',
  })
  name: string;

  @IsString()
  @MaxLength(100, {
    message: 'Surname is too long. Maximum length is $constraint1 characters.',
  })
  surname: string;

  @IsString()
  @MaxLength(100, {
    message:
      'Patronymic is too long. Maximum length is $constraint1 characters.',
  })
  patronymic?: string;

  @IsEnum(UserGender, {
    message: `Gender must be one of the following values: ${Object.values(UserGender).join(', ')}.`,
  })
  gender: UserGender;

  @IsDate({
    message: 'Birth date must be a valid date. (YYYY-MM-DD)',
  })
  birthDate: Date;

  @IsPhoneNumber(undefined, {
    message: 'Phone number must be a valid phone number.',
  })
  phone: string;
}
