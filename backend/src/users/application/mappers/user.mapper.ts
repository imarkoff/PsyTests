import { UserDto } from '../../presentation/dtos/user.dto';
import { User } from '../../domain/entities/user.entity';
import { UserCreateDto } from '../../presentation/dtos/user-create.dto';
import { HashedPassword } from '../../../core/auth/password/types/hashed-password.type';
import { UUID } from 'node:crypto';
import { UserRole } from '../../../shared/enums/user-role.enum';
import { UserUpdateDto } from '../../presentation/dtos/user-update.dto';

export class UserMapper {
  static toDto(user: User): UserDto {
    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
      patronymic: user.patronymic,
      gender: user.gender,
      birthDate: user.birthDate,
      phone: user.phone,
      role: user.role,
      registeredAt: user.registeredAt,
      registeredBy: user.registeredById,
      lastLoginAt: user.lastLoginAt,
    };
  }

  static fromCreateDto(
    userCreateDto: UserCreateDto,
    hashedPassword: HashedPassword,
    registeredById?: UUID,
  ): User {
    const user = new User();
    user.name = userCreateDto.name;
    user.surname = userCreateDto.surname;
    user.patronymic = userCreateDto.patronymic || null;
    user.gender = userCreateDto.gender;
    user.birthDate = userCreateDto.birthDate;
    user.phone = userCreateDto.phone;
    user.password = hashedPassword.hash;
    user.passwordSalt = hashedPassword.salt;
    user.role = userCreateDto.role || UserRole.PATIENT;
    user.registeredAt = new Date();
    user.registeredById = registeredById || null;
    return user;
  }

  static applyUpdates(user: User, updateData: UserUpdateDto): User {
    user.name = updateData.name;
    user.surname = updateData.surname;
    user.patronymic = updateData.patronymic || null;
    user.gender = updateData.gender;
    user.birthDate = updateData.birthDate;
    user.phone = updateData.phone;
    return user;
  }
}
