import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserModelByPhoneQuery } from './get-user-model-by-phone.query';
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { User } from 'src/users/domain/entities/user.entity';

@QueryHandler(GetUserModelByPhoneQuery)
export class GetUserModelByPhoneHandler
  implements IQueryHandler<GetUserModelByPhoneQuery>
{
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Execute the query to get a user database model by phone number.
   * @param phoneNumber - The phone number of the user to retrieve.
   * @returns A promise that resolves to the user database model or null if not found.
   */
  execute({ phoneNumber }: GetUserModelByPhoneQuery): Promise<User | null> {
    return this.userRepository.getUserByPhone(phoneNumber);
  }
}
