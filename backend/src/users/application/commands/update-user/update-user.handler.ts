import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from './update-user.command';
import { UserDto } from 'src/users/presentation/dtos/user.dto';
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found.exception';
import { PhoneIsAlreadyTakenException } from '../../../domain/exceptions/phone-is-already-taken.exception';
import { UserMapper } from '../../mappers/user.mapper';
import { Logger } from '@nestjs/common';
import { UUID } from 'node:crypto';
import { User } from '../../../domain/entities/user.entity';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  private readonly logger = new Logger(UpdateUserHandler.name);

  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Update a user's information.
   * @param userId - The ID of the user to update.
   * @param updateData - The new data for the user.
   * @returns The updated user data as a UserDto.
   * @throws UserNotFoundException if the user with the given ID does not exist.
   * @throws PhoneIsAlreadyTakenException if the new phone number is already in use by another user.
   */
  async execute({ userId, updateData }: UpdateUserCommand): Promise<UserDto> {
    this.logger.debug(
      `Executing UpdateUserCommand for userId: ${userId} with data.`,
      updateData,
    );

    const user = await this.getUserById(userId);

    await this.checkCanUpdatePhone(user.phone, updateData.phone);

    user.applyChanges(updateData);
    await this.userRepository.updateUser(user);

    this.logger.log(`User with ID ${userId} successfully updated.`);

    return UserMapper.toDto(user);
  }

  private async getUserById(userId: UUID): Promise<User> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      this.logger.warn(`User with ID ${userId} not found.`);
      throw new UserNotFoundException(userId);
    }
    return user;
  }

  private async checkCanUpdatePhone(
    oldPhone: string,
    newPhone: string,
  ): Promise<void> {
    if (oldPhone === newPhone) {
      this.logger.debug(
        'Phone number unchanged, no need to check for uniqueness.',
      );
      return;
    }

    const existingUserWithPhone =
      await this.userRepository.getUserByPhone(newPhone);

    if (existingUserWithPhone) {
      this.logger.warn(`Phone number ${newPhone} is already taken.`);
      throw new PhoneIsAlreadyTakenException(newPhone);
    }

    this.logger.debug(`Phone number ${newPhone} is available for use.`);
  }
}
