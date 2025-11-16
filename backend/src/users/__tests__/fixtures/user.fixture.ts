import { randomUUID } from 'node:crypto';
import { UserGender } from '../../../shared/enums/user-gender.enum';
import { Buffer } from 'node:buffer';
import { UserRole } from '../../../shared/enums/user-role.enum';
import { User } from '../../domain/entities/user.entity';

export const createUserFixture = (overrides: Partial<User> = {}): User => {
  const persistence = {
    id: randomUUID(),
    name: 'John',
    surname: 'Doe',
    patronymic: null,
    gender: UserGender.MALE,
    birthDate: new Date('1990-01-01'),
    phone: '+1234567890',
    password: Buffer.from('hash'),
    passwordSalt: Buffer.from('salt'),
    registeredAt: new Date(),
    lastLoginAt: new Date(),
    role: UserRole.PATIENT,
    registeredById: null,
    deletedAt: null,
    ...overrides,
  };

  const user = new User();
  Object.assign(user, persistence);
  return user;
};
