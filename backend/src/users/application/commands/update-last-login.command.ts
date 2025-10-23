import { Command } from '@nestjs/cqrs';
import { UUID } from 'node:crypto';

export class UpdateLastLoginCommand extends Command<void> {
  /**
   * @param userId - The unique identifier of the user whose last login time is to be updated.
   * @throws UserNotFoundException if the user with the given ID does not exist.
   */
  constructor(public readonly userId: UUID) {
    super();
  }
}
