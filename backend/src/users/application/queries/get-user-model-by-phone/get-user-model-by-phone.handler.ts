import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserModelByPhoneQuery } from './get-user-model-by-phone.query';
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { Logger } from '@nestjs/common';

@QueryHandler(GetUserModelByPhoneQuery)
export class GetUserModelByPhoneHandler
  implements IQueryHandler<GetUserModelByPhoneQuery>
{
  private readonly logger = new Logger(GetUserModelByPhoneHandler.name);

  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Execute the query to get a user database model by phone number.
   * @param phoneNumber - The phone number of the user to retrieve.
   * @returns A promise that resolves to the user database model or null if not found.
   */
  execute({ phoneNumber }: GetUserModelByPhoneQuery): Promise<User | null> {
    this.logger.debug(
      `Executing GetUserModelByPhoneQuery for phone number: ${phoneNumber}`,
    );
    return this.userRepository.getUserByPhone(phoneNumber);
  }
}
