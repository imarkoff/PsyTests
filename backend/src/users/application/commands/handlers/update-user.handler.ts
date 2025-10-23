import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../update-user.command';
import { UserDto } from 'src/users/presentation/dtos/user.dto';
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found.exception';
import { PhoneIsAlreadyTakenException } from '../../../domain/exceptions/phone-is-already-taken.exception';
import { User } from '../../../domain/entities/user.entity';
import { UserMapper } from '../../mappers/user.mapper';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
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
    const user = await this.userRepository.getUserById(userId);
    if (!user) throw new UserNotFoundException(userId);

    await this.checkCanUpdatePhone(user.phone, updateData.phone);

    const updatedUser = User.updateFromDto(user, updateData);
    await this.userRepository.updateUser(updatedUser);

    return UserMapper.toDto(updatedUser);
  }

  private async checkCanUpdatePhone(
    oldPhone: string,
    newPhone: string,
  ): Promise<void> {
    if (oldPhone === newPhone) return;

    const existingUserWithPhone =
      await this.userRepository.getUserByPhone(newPhone);

    if (existingUserWithPhone) {
      throw new PhoneIsAlreadyTakenException(newPhone);
    }
  }
}
