import { Command } from '@nestjs/cqrs';
import { UUID } from 'node:crypto';

export class ChangePasswordByAdminCommand extends Command<void> {
  /**
   * @param userId - The unique identifier of the user whose password is to be changed.
   * @param changedById - The unique identifier of the user who is changing the password.
   * @param newPassword - The new password to be set for the user.
   * @throws UserNotFoundException if the user with the given ID does not exist.
   * @throws ForbiddenToChangePasswordException if the user who is attempting to change the password does not have permission.
   */
  constructor(
    public readonly userId: UUID,
    public readonly changedById: UUID,
    public readonly newPassword: string,
  ) {
    super();
  }
}
