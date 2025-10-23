import { UserDto } from '../../presentation/dtos/user.dto';
import { User } from '../../domain/entities/user.entity';

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
}
