import { GetUserByPhoneQuery } from '../get-user-by-phone.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { UserMapper } from '../../mappers/user.mapper';

@QueryHandler(GetUserByPhoneQuery)
export class GetUserByPhoneHandler
  implements IQueryHandler<GetUserByPhoneQuery>
{
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Gets a user by their phone number.
   * @param phoneNumber - The phone number of the user to retrieve.
   * @returns A promise that resolves to the UserDto if found, or null if not found.
   */
  async execute({ phoneNumber }: GetUserByPhoneQuery) {
    const user = await this.userRepository.getUserByPhone(phoneNumber);

    if (!user) return null;
    return UserMapper.toDto(user);
  }
}
