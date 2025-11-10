import { UserGender } from '../../../shared/enums/user-gender.enum';
import { IsDate, IsEnum, IsPhoneNumber } from 'class-validator';
import { IsPasswordValid } from '../../../core/decorators/is-password-valid.decorator';
import { UserCreateDto } from '../../../users/presentation/dtos/user-create.dto';
import { UserRole } from '../../../shared/enums/user-role.enum';

export class PatientCreateDto {
  name: string;

  surname: string;

  patronymic: string | null;

  @IsEnum(UserGender)
  gender: UserGender;

  @IsDate()
  birthDate: Date;

  @IsPhoneNumber()
  phone: string;

  @IsPasswordValid()
  password: string;

  toUserCreateDto(): UserCreateDto {
    const userCreateDto = new UserCreateDto();
    userCreateDto.name = this.name;
    userCreateDto.surname = this.surname;
    userCreateDto.patronymic = this.patronymic;
    userCreateDto.gender = this.gender;
    userCreateDto.birthDate = this.birthDate;
    userCreateDto.password = this.password;
    userCreateDto.role = UserRole.PATIENT;
    userCreateDto.phone = this.phone;
    return userCreateDto;
  }
}
