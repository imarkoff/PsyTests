import { UserUpdateDto } from '../../presentation/dtos/user-update.dto';
import { UserGender } from '../../../shared/enums/user-gender.enum';

export const createUserUpdateDtoFixture = (
  overrides?: Partial<UserUpdateDto>,
): UserUpdateDto => ({
  name: 'Jane',
  surname: 'Doe',
  patronymic: 'A.',
  gender: UserGender.FEMALE,
  birthDate: new Date('1992-02-02'),
  phone: '+19876543210',
  ...overrides,
});
