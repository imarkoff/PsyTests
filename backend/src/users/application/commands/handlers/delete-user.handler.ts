import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from '../delete-user.command';
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found.exception';
import { RoleValidator } from '../../../../core/validations/role-validator/role-validator.interface';
import { ForbiddenToDeleteUserException } from '../../../domain/exceptions/forbidden-to-delete-user.exception';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
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
    const user = await this.userRepository.getUserById(userId);
    if (!user) throw new UserNotFoundException(userId);

    const adminUser = await this.userRepository.getUserById(deletedById);
    if (!adminUser) throw new UserNotFoundException(deletedById);

    if (!this.roleValidator.isAdmin(adminUser.role)) {
      throw new ForbiddenToDeleteUserException();
    }

    await this.userRepository.deleteUser(userId);
  }
}
