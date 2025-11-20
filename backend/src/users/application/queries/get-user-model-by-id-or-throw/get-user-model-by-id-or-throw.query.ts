import { Query } from '@nestjs/cqrs';
import { User } from '../../../domain/entities/user.entity';
import { UUID } from 'node:crypto';

export class GetUserModelByIdOrThrowQuery extends Query<User> {
  /**
   * Gets user model by ID or throws an exception if not found.
   * @param userId - The UUID of the user to retrieve.
   * @returns User model.
   * @throws UserNotFoundException if the user does not exist.
   */
  constructor(public readonly userId: UUID) {
    super();
  }
}
