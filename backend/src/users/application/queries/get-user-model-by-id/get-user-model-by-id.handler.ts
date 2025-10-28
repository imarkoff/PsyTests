import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserModelByIdQuery } from './get-user-model-by-id.query';
import { User } from 'src/users/domain/entities/user.entity';
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';

@QueryHandler(GetUserModelByIdQuery)
export class GetUserModelByIdHandler
  implements IQueryHandler<GetUserModelByIdQuery>
{
  constructor(private readonly userRepository: UserRepository) {}

  execute({ userId }: GetUserModelByIdQuery): Promise<User | null> {
    return this.userRepository.getUserById(userId);
  }
}
