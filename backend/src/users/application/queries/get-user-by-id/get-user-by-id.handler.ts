import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserByIdQuery } from './get-user-by-id.query';
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { UserMapper } from '../../mappers/user.mapper';
import { UserDto } from '../../../presentation/dtos/user.dto';
import { Logger } from '@nestjs/common';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  private readonly logger = new Logger(GetUserByIdHandler.name);

  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Gets a user by their ID.
   * @param userId - The ID of the user to retrieve.
   * @returns A promise that resolves to the UserDto if found, or null if not found.
   */
  async execute({ userId }: GetUserByIdQuery): Promise<UserDto | null> {
    this.logger.debug(`Fetching user with ID: ${userId}`);

    const user = await this.userRepository.getUserById(userId);

    if (!user) {
      this.logger.debug(`User with ID: ${userId} not found.`);
      return null;
    }

    this.logger.debug(`User with ID: ${userId} found.`);

    return UserMapper.toDto(user);
  }
}
