import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from './delete-user.command';
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found.exception';
import { RoleValidator } from '../../../../core/validations/role-validator/role-validator.interface';
import { ForbiddenToDeleteUserException } from '../../../domain/exceptions/forbidden-to-delete-user.exception';
import { Logger } from '@nestjs/common';
import { UUID } from 'node:crypto';
import { User } from '../../../domain/entities/user.entity';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  private readonly logger = new Logger(DeleteUserHandler.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleValidator: RoleValidator,
  ) {}

  /**
   * Deletes a user if the requester has admin privileges.
   * @param userId - ID of the user to be deleted.
   * @param deletedById - ID of the user performing the deletion.
   * @throws UserNotFoundException if the user to be deleted or the admin user does not exist.
   * @throws ForbiddenToDeleteUserException if the user performing the deletion is not an admin.
   */
  async execute({ userId, deletedById }: DeleteUserCommand): Promise<void> {
    this.logger.debug(
      `Attempting to delete user with ID: ${userId} by admin with ID: ${deletedById}`,
    );

    await this.checkUserToDeleteExists(userId);
    await this.checkAdminExists(deletedById);

    await this.userRepository.deleteUser(userId);

    this.logger.log(
      `User with ID: ${userId} successfully deleted by admin with ID: ${deletedById}`,
    );
  }

  private async checkUserToDeleteExists(userId: UUID): Promise<User> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      this.logger.warn(`User with ID: ${userId} not found for deletion`);
      throw new UserNotFoundException(userId);
    }
    this.logger.debug(`User with ID: ${userId} found for deletion`);
    return user;
  }

  private async checkAdminExists(deletedById: UUID): Promise<User> {
    const adminUser = await this.userRepository.getUserById(deletedById);

    if (!adminUser) {
      this.logger.warn(`Admin user with ID: ${deletedById} not found`);
      throw new UserNotFoundException(deletedById);
    }

    this.validateIsAdminUser(adminUser);

    return adminUser;
  }

  private validateIsAdminUser(possibleAdmin: User): void {
    if (!this.roleValidator.isAdmin(possibleAdmin.role)) {
      this.logger.warn(
        `User with ID: ${possibleAdmin.id} is not authorized to delete users`,
      );
      throw new ForbiddenToDeleteUserException();
    }

    this.logger.debug(
      `User with ID: ${possibleAdmin.id} authorized to delete users`,
    );
  }
}
