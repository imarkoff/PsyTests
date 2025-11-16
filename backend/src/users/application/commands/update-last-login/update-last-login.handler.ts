import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateLastLoginCommand } from './update-last-login.command';
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found.exception';
import { Logger } from '@nestjs/common';

@CommandHandler(UpdateLastLoginCommand)
export class UpdateLastLoginHandler
  implements ICommandHandler<UpdateLastLoginCommand>
{
  private readonly logger = new Logger(UpdateLastLoginHandler.name);

  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Handles the UpdateLastLoginCommand to update the last login timestamp of a user.
   * @param userId - The unique identifier of the user whose last login timestamp is to be updated.
   * @throws UserNotFoundException if the user with the given ID does not exist.
   */
  async execute({ userId }: UpdateLastLoginCommand): Promise<void> {
    this.logger.debug(`Updating last login for user with ID: ${userId}`);

    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      this.logger.warn(
        `User with ID ${userId} not found while updating last login`,
      );
      throw new UserNotFoundException(userId);
    }

    user.lastLoginAt = new Date();
    await this.userRepository.updateUser(user);

    this.logger.log(
      `Successfully updated last login for user with ID: ${userId}`,
    );
  }
}
