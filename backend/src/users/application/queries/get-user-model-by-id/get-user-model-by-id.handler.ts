import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserModelByIdQuery } from './get-user-model-by-id.query';
import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { Logger } from '@nestjs/common';

@QueryHandler(GetUserModelByIdQuery)
export class GetUserModelByIdHandler
  implements IQueryHandler<GetUserModelByIdQuery>
{
  private readonly logger = new Logger(GetUserModelByIdHandler.name);

  constructor(private readonly userRepository: UserRepository) {}

  execute({ userId }: GetUserModelByIdQuery): Promise<User | null> {
    this.logger.debug(`Fetching user with ID: ${userId}`);
    return this.userRepository.getUserById(userId);
  }
}
