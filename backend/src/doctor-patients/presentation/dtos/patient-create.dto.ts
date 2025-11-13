import { UserGender } from '../../../shared/enums/user-gender.enum';
import { IsDate, IsEnum, IsPhoneNumber } from 'class-validator';
import { IsPasswordValid } from '../../../core/decorators/is-password-valid.decorator';
import { UserCreateDto } from '../../../users/presentation/dtos/user-create.dto';
import { UserRole } from '../../../shared/enums/user-role.enum';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  description: 'Data Transfer Object for creating a new patient',
})
export class PatientCreateDto {
  /** Patient's first name */
  @ApiProperty()
  name: string;

  /** Patient's last name */
  @ApiProperty()
  surname: string;

  /** Patient's patronymic (middle name), can be null */
  @ApiProperty({ nullable: true })
  patronymic: string | null;

  /** Patient gender */
  @ApiProperty({ enum: UserGender })
  @IsEnum(UserGender)
  gender: UserGender;

  /** Patient's birthdate */
  @ApiProperty({ format: 'date-time' })
  @IsDate()
  birthDate: Date;

  /** Patient's phone number */
  @ApiProperty()
  @IsPhoneNumber()
  phone: string;

  /** Patient's password */
  @ApiProperty()
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
