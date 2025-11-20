import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserModelByIdOrThrowQuery } from './get-user-model-by-id-or-throw.query';
import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found.exception';

@QueryHandler(GetUserModelByIdOrThrowQuery)
export class GetUserModelByIdOrThrowHandler
  implements IQueryHandler<GetUserModelByIdOrThrowQuery>
{
  constructor(private readonly repository: UserRepository) {}

  async execute({ userId }: GetUserModelByIdOrThrowQuery): Promise<User> {
    const user = await this.repository.getUserById(userId);
    if (!user) throw new UserNotFoundException(userId);
    return user;
  }
}
