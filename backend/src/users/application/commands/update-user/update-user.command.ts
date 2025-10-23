import { Command } from '@nestjs/cqrs';
import { UserDto } from '../../../presentation/dtos/user.dto';
import { UserUpdateDto } from '../../../presentation/dtos/user-update.dto';
import { UUID } from 'node:crypto';

export class UpdateUserCommand extends Command<UserDto> {
  /**
   * @param userId - The unique identifier of the user to be updated.
   * @param updateData - Data Transfer Object containing the updated user details.
   * @throws UserNotFoundException if the user with the given ID does not exist.
   * @throws PhoneIsAlreadyTakenException if the phone number is already in use.
   */
  constructor(
    public readonly userId: UUID,
    public readonly updateData: UserUpdateDto,
  ) {
    super();
  }
}
