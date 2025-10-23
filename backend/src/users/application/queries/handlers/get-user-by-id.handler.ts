import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserByIdQuery } from '../get-user-by-id.query';
import { UserDto } from 'src/users/presentation/dtos/user.dto';
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { UserMapper } from '../../mappers/user.mapper';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Gets a user by their ID.
   * @param userId - The ID of the user to retrieve.
   * @returns A promise that resolves to the UserDto if found, or null if not found.
   */
  async execute({ userId }: GetUserByIdQuery): Promise<UserDto | null> {
    const user = await this.userRepository.getUserById(userId);

    if (!user) return null;
    return UserMapper.toDto(user);
  }
}
