import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChangePasswordByAdminCommand } from './change-password-by-admin.command';
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found.exception';
import { RoleValidator } from '../../../../core/validations/role-validator/role-validator.interface';
import { ForbiddenToChangePasswordException } from '../../../domain/exceptions/forbidden-to-change-password.exception';
import { PasswordService } from '../../../../core/auth/password/password.interface';
import { Logger } from '@nestjs/common';

@CommandHandler(ChangePasswordByAdminCommand)
export class ChangePasswordByAdminHandler
  implements ICommandHandler<ChangePasswordByAdminCommand>
{
  private readonly logger = new Logger(ChangePasswordByAdminHandler.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleValidator: RoleValidator,
    private readonly passwordService: PasswordService,
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
    this.logger.debug('Executing ChangePasswordByAdminCommand', {
      userId,
      changedById,
    });

    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      this.logger.warn(`User with ID ${userId} not found.`);
      throw new UserNotFoundException(userId);
    }

    const changedBy = await this.userRepository.getUserById(changedById);
    if (!changedBy) {
      this.logger.warn(`Admin user with ID ${changedById} not found.`);
      throw new UserNotFoundException(changedById);
    }

    if (!this.roleValidator.isAdmin(changedBy.role)) {
      this.logger.warn(
        `User with ID ${changedById} is not authorized to change passwords.`,
      );
      throw new ForbiddenToChangePasswordException(
        "Only administrators can change other users' passwords.",
      );
    }

    const hashedPassword = await this.passwordService.hashPassword(newPassword);

    user.password = hashedPassword.hash;
    user.passwordSalt = hashedPassword.salt;
    await this.userRepository.updateUser(user);

    this.logger.debug(
      `Password for user ID ${userId} changed successfully by admin ID ${changedById}.`,
    );
  }
}
