import { GetUserByPhoneQuery } from './get-user-by-phone.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { UserMapper } from '../../mappers/user.mapper';
import { Logger } from '@nestjs/common';

@QueryHandler(GetUserByPhoneQuery)
export class GetUserByPhoneHandler
  implements IQueryHandler<GetUserByPhoneQuery>
{
  private readonly logger = new Logger(GetUserByPhoneHandler.name);

  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Gets a user by their phone number.
   * @param phoneNumber - The phone number of the user to retrieve.
   * @returns A promise that resolves to the UserDto if found, or null if not found.
   */
  async execute({ phoneNumber }: GetUserByPhoneQuery) {
    this.logger.debug(`Getting user by phone number: ${phoneNumber}`);

    const user = await this.userRepository.getUserByPhone(phoneNumber);

    if (!user) {
      this.logger.debug(`No user found with phone number: ${phoneNumber}`);
      return null;
    }

    this.logger.debug(`User found with phone number: ${phoneNumber}`);

    return UserMapper.toDto(user);
  }
}
