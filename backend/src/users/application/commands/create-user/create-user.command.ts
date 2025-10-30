import { UserDto } from '../../../presentation/dtos/user.dto';
import { Command } from '@nestjs/cqrs';
import { UserCreateDto } from '../../../presentation/dtos/user-create.dto';
import { UUID } from 'crypto';

/**
 * Command to create a new user.
 */
export class CreateUserCommand extends Command<UserDto> {
  /**
   * @param userCreateDto - Data Transfer Object containing user creation details.
   * @param registeredById - Optional ID of the user who is registering the new user.
   * @throws PhoneIsAlreadyTakenException if the phone number is already in use.
   * @throws UserNotFoundException if the registering user does not exist.
   * @throws ForbiddenToRegisterUserException if the registering user does not have sufficient privileges.
   */
  constructor(
    public readonly userCreateDto: UserCreateDto,
    public readonly registeredById?: UUID,
  ) {
    super();
  }
}
