import { PatientCreateDto } from '../../presentation/dtos/patient-create.dto';
import { UserGender } from '../../../shared/enums/user-gender.enum';

export const createPatientCreateFixture = (
  overrides?: Partial<PatientCreateDto>,
): PatientCreateDto => {
  const persistence = {
    name: 'John',
    surname: 'Doe',
    patronymic: 'Smith',
    gender: UserGender.MALE,
    phone: '+1234567890',
    birthDate: new Date('1990-01-01'),
    password: 'securePassword123',
    ...overrides,
  };

  const dto = new PatientCreateDto();
  dto.name = persistence.name;
  dto.surname = persistence.surname;
  dto.patronymic = persistence.patronymic;
  dto.gender = persistence.gender;
  dto.phone = persistence.phone;
  dto.birthDate = persistence.birthDate;
  dto.password = persistence.password;

  return dto;
};
