import { UserGender } from '../../../shared/enums/user-gender.enum';
import { UserRole } from '../../../shared/enums/user-role.enum';
import { UserCreateDto } from '../../presentation/dtos/user-create.dto';

export const createUserCreateDtoFixture = (
  overrides?: Partial<UserCreateDto>,
): UserCreateDto => {
  return {
    phone: '+12345678901',
    role: UserRole.PATIENT,
    gender: UserGender.MALE,
    password: 'securepassword',
    name: 'John',
    surname: 'Doe',
    patronymic: null,
    birthDate: new Date('1990-01-01'),
    ...overrides,
  };
};
