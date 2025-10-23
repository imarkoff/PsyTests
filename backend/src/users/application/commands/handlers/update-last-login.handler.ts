import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateLastLoginCommand } from '../update-last-login.command';
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found.exception';

@CommandHandler(UpdateLastLoginCommand)
export class UpdateLastLoginHandler
  implements ICommandHandler<UpdateLastLoginCommand>
{
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Handles the UpdateLastLoginCommand to update the last login timestamp of a user.
   * @param userId - The unique identifier of the user whose last login timestamp is to be updated.
   * @throws UserNotFoundException if the user with the given ID does not exist.
   */
  async execute({ userId }: UpdateLastLoginCommand): Promise<void> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) throw new UserNotFoundException(userId);

    user.updateLastLoginAt();
    await this.userRepository.updateUser(user);
  }
}
