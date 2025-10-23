import { UUID } from 'crypto';
import { UserRole } from '../../../shared/enums/user-role.enum';
import { UserGender } from '../../../shared/enums/user-gender.enum';
import { UserCreateDto } from '../../presentation/dtos/user-create.dto';
import { randomUUID } from 'node:crypto';
import { HashedPassword } from '../../../core/auth/password-hasher/types/hashed-password.type';
import { UserUpdateDto } from '../../presentation/dtos/user-update.dto';
import { User as PrismaUser } from 'generated/prisma';

export class User {
  private _id: UUID;
  get id(): UUID {
    return this._id;
  }
  private set id(id: UUID) {
    this._id = id;
  }

  private _name: string;
  get name(): string {
    return this._name;
  }
  private set name(name: string) {
    this._name = name;
  }

  private _surname: string;
  get surname(): string {
    return this._surname;
  }
  private set surname(surname: string) {
    this._surname = surname;
  }

  private _patronymic: string | null;
  get patronymic(): string | null {
    return this._patronymic;
  }
  private set patronymic(patronymic: string | null) {
    this._patronymic = patronymic;
  }

  private _gender: UserGender;
  get gender(): UserGender {
    return this._gender;
  }
  private set gender(gender: UserGender) {
    this._gender = gender;
  }

  private _birthDate: Date;
  get birthDate(): Date {
    return this._birthDate;
  }
  private set birthDate(birthDate: Date) {
    this._birthDate = birthDate;
  }

  private _phone: string;
  get phone(): string {
    return this._phone;
  }
  private set phone(phone: string) {
    this._phone = phone;
  }

  private _password: Uint8Array<ArrayBufferLike>;
  get password(): Uint8Array<ArrayBufferLike> {
    return this._password;
  }
  private set password(password: Uint8Array<ArrayBufferLike>) {
    this._password = password;
  }

  private _passwordSalt: Uint8Array<ArrayBufferLike>;
  get passwordSalt(): Uint8Array<ArrayBufferLike> {
    return this._passwordSalt;
  }
  private set passwordSalt(passwordSalt: Uint8Array<ArrayBufferLike>) {
    this._passwordSalt = passwordSalt;
  }

  private _role: UserRole;
  get role(): UserRole {
    return this._role;
  }
  private set role(role: UserRole) {
    this._role = role;
  }

  private _registeredById: UUID | null;
  get registeredById(): UUID | null {
    return this._registeredById;
  }
  private set registeredById(registeredById: UUID | null) {
    this._registeredById = registeredById;
  }

  private _registeredAt: Date;
  get registeredAt(): Date {
    return this._registeredAt;
  }
  private set registeredAt(registeredAt: Date) {
    this._registeredAt = registeredAt;
  }

  private _lastLoginAt: Date | null;
  get lastLoginAt(): Date | null {
    return this._lastLoginAt;
  }
  private set lastLoginAt(lastLoginAt: Date | null) {
    this._lastLoginAt = lastLoginAt;
  }

  private _deletedAt: Date | null;
  get deletedAt(): Date | null {
    return this._deletedAt;
  }
  private set deletedAt(deletedAt: Date | null) {
    this._deletedAt = deletedAt;
  }

  private constructor(
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
  ) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.patronymic = patronymic;
    this.gender = gender;
    this.birthDate = birthDate;
    this.phone = phone;
    this.password = password;
    this.passwordSalt = passwordSalt;
    this.role = role;
    this.registeredById = registeredById;
    this.registeredAt = registeredAt;
    this.lastLoginAt = lastLoginAt;
    this.deletedAt = deletedAt;
  }

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

  static fromPersistence(persistenceUser: PrismaUser): User {
    return new User(
      persistenceUser.id as UUID,
      persistenceUser.name,
      persistenceUser.surname,
      persistenceUser.patronymic,
      persistenceUser.gender,
      persistenceUser.birthDate,
      persistenceUser.phone,
      persistenceUser.password,
      persistenceUser.passwordSalt,
      persistenceUser.role,
      persistenceUser.registeredById as UUID | null,
      persistenceUser.registeredAt,
      persistenceUser.lastLoginAt,
      persistenceUser.deletedAt,
    );
  }

  applyChanges(updateData: UserUpdateDto) {
    this.name = updateData.name;
    this.surname = updateData.surname;
    this.patronymic = updateData.patronymic || null;
    this.gender = updateData.gender;
    this.birthDate = updateData.birthDate;
    this.phone = updateData.phone;
    return this;
  }

  changePassword(hashedPassword: HashedPassword) {
    this.password = hashedPassword.hash;
    this.passwordSalt = hashedPassword.salt;
  }

  updateLastLoginAt() {
    this.lastLoginAt = new Date();
  }
}
