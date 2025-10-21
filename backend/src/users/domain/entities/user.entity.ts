import { UUID } from 'crypto';
import { UserRole } from '../../../shared/enums/user-role.enum';
import { UserGender } from '../../../shared/enums/user-gender.enum';
import { UserCreateDto } from '../../presentation/dtos/user-create.dto';
import { randomUUID } from 'node:crypto';
import { HashedPassword } from '../../../core/auth/password-hasher/types/hashed-password.type';

export class User {
  private constructor(
    public readonly id: UUID,
    public readonly name: string,
    public readonly surname: string,
    public readonly patronymic: string | null,
    public readonly gender: UserGender,
    public readonly birthDate: Date,
    public readonly phone: string,
    public readonly password: Uint8Array<ArrayBufferLike>,
    public readonly passwordSalt: Uint8Array<ArrayBufferLike>,
    public readonly role: UserRole,
    public readonly registeredById: UUID | null,
    public readonly registeredAt: Date,
    public readonly lastLoginAt: Date | null,
    public readonly deletedAt: Date | null,
  ) {}

  static create(
    entity: UserCreateDto,
    password: HashedPassword,
    registeredById?: UUID,
  ): User {
    return new User(
      randomUUID(),
      entity.name,
      entity.surname,
      entity.patronymic,
      entity.gender,
      entity.birthDate,
      entity.phone,
      password.hash,
      password.salt,
      entity.role || UserRole.PATIENT,
      registeredById || null,
      new Date(),
      null,
      null,
    );
  }

  static fromPersistence(
    id: UUID,
    name: string,
    surname: string,
    patronymic: string | null,
    gender: UserGender,
    birthDate: Date,
    phone: string,
    password: Uint8Array,
    passwordSalt: Uint8Array,
    role: UserRole,
    registeredById: UUID | null,
    registeredAt: Date,
    lastLoginAt: Date | null,
    deletedAt: Date | null,
  ): User {
    return new User(
      id,
      name,
      surname,
      patronymic,
      gender,
      birthDate,
      phone,
      password,
      passwordSalt,
      role,
      registeredById,
      registeredAt,
      lastLoginAt,
      deletedAt,
    );
  }
}
