import { Command } from '@nestjs/cqrs';
import { UUID } from 'node:crypto';

export class DeleteUserCommand extends Command<void> {
  /**
   * Deletes a user by their unique identifier.
   * @param userId - The unique identifier of the user to be deleted.
   * @param deletedById - The unique identifier of the user performing the deletion. Only administrators can delete users.
   * @throws UserNotFoundException if the user with the given ID does not exist (user or administrator).
   * @throws ForbiddenToDeleteUserException if the user attempting to delete does not have the necessary permissions.
   */
  constructor(
    public readonly userId: UUID,
    public readonly deletedById: UUID,
  ) {
    super();
  }
}
