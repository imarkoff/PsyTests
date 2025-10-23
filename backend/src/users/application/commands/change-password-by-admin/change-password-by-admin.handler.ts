import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChangePasswordByAdminCommand } from './change-password-by-admin.command';
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found.exception';
import { RoleValidator } from '../../../../core/validations/role-validator/role-validator.interface';
import { ForbiddenToChangePasswordException } from '../../../domain/exceptions/forbidden-to-change-password.exception';
import { PasswordHasher } from '../../../../core/auth/password-hasher/password-hasher.interface';

@CommandHandler(ChangePasswordByAdminCommand)
export class ChangePasswordByAdminHandler
  implements ICommandHandler<ChangePasswordByAdminCommand>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleValidator: RoleValidator,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  /**
   * Change the password of a user by an administrator.
   * @param userId - The unique identifier of the user whose password is to be changed.
   * @param changedById - The unique identifier of the administrator performing the change.
   * @param newPassword - The new password to be set for the user.
   * @throws UserNotFoundException if either the user or the administrator does not exist.
   * @throws ForbiddenToChangePasswordException if the user performing the change is not an administrator.
   */
  async execute({
    userId,
    changedById,
    newPassword,
  }: ChangePasswordByAdminCommand): Promise<void> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) throw new UserNotFoundException(userId);

    const changedBy = await this.userRepository.getUserById(changedById);
    if (!changedBy) throw new UserNotFoundException(changedById);

    if (!this.roleValidator.isAdmin(changedBy.role)) {
      throw new ForbiddenToChangePasswordException(
        "Only administrators can change other users' passwords.",
      );
    }

    const hashedPassword = await this.passwordHasher.hashPassword(newPassword);

    user.changePassword(hashedPassword);
    await this.userRepository.updateUser(user);
  }
}
