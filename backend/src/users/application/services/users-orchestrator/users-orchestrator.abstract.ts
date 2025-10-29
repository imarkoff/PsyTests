import { UUID } from 'node:crypto';
import { UserDto } from '../../../presentation/dtos/user.dto';

export abstract class UsersOrchestrator {
  /**
   * Get a user by their unique identifier.
   * @param userId - UUID of the user to retrieve.
   * @returns A Promise that resolves to the UserDto.
   * @throws UserNotFoundException if the user with the given ID does not exist.
   */
  abstract getUserById(userId: UUID): Promise<UserDto>;
}
