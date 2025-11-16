import { DeleteUserHandler } from '../../../application/commands/delete-user/delete-user.handler';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found.exception';
import { ForbiddenToDeleteUserException } from '../../../domain/exceptions/forbidden-to-delete-user.exception';
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { RoleValidator } from '../../../../core/validations/role-validator/role-validator.interface';
import { Test } from '@nestjs/testing';
import { UserRole } from '../../../../shared/enums/user-role.enum';
import { DeleteUserCommand } from '../../../application/commands/delete-user/delete-user.command';
import { randomUUID, UUID } from 'node:crypto';
import { createUserFixture } from '../../fixtures/user.fixture';

describe(DeleteUserHandler.name, () => {
  let handler: DeleteUserHandler;
  const userRepository: Pick<
    jest.Mocked<UserRepository>,
    'getUserById' | 'deleteUser'
  > = {
    getUserById: jest.fn(),
    deleteUser: jest.fn(),
  };
  const roleValidator: Pick<jest.Mocked<RoleValidator>, 'isAdmin'> = {
    isAdmin: jest
      .fn()
      .mockImplementation((role: UserRole) => role === UserRole.ADMIN),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        DeleteUserHandler,
        {
          provide: UserRepository,
          useValue: userRepository,
        },
        {
          provide: RoleValidator,
          useValue: roleValidator,
        },
      ],
    }).compile();

    handler = module.get(DeleteUserHandler);
  });

  it('deletes the user when requester is admin and both users exist', async () => {
    const user = createUserFixture();
    const admin = createUserFixture({ role: UserRole.ADMIN });
    userRepository.getUserById.mockImplementation((id: string) => {
      if (id === user.id) return Promise.resolve(user);
      if (id === admin.id) return Promise.resolve(admin);
      return Promise.resolve(null);
    });

    await handler.execute({
      userId: user.id,
      deletedById: admin.id,
    } as DeleteUserCommand);

    expect(userRepository.getUserById).toHaveBeenCalledWith(user.id);
    expect(userRepository.getUserById).toHaveBeenCalledWith(admin.id);
    expect(roleValidator.isAdmin).toHaveBeenCalledWith(admin.role);
    expect(userRepository.deleteUser).toHaveBeenCalledWith(user.id);
  });

  it('throws UserNotFoundException when target user to delete does not exist', async () => {
    const userId = randomUUID();
    const admin = createUserFixture({ role: UserRole.ADMIN });
    userRepository.getUserById.mockImplementation((id: UUID) => {
      if (id === admin.id) return Promise.resolve(admin);
      return Promise.resolve(null);
    });

    await expect(
      handler.execute({ userId, deletedById: admin.id } as DeleteUserCommand),
    ).rejects.toBeInstanceOf(UserNotFoundException);

    expect(userRepository.getUserById).toHaveBeenCalledWith(userId);
    expect(roleValidator.isAdmin).not.toHaveBeenCalled();
    expect(userRepository.deleteUser).not.toHaveBeenCalled();
  });

  it('throws UserNotFoundException when admin performing deletion does not exist', async () => {
    const user = createUserFixture();
    const deletedById = randomUUID();
    userRepository.getUserById.mockImplementation((id: UUID) => {
      if (id === user.id) return Promise.resolve(user);
      return Promise.resolve(null);
    });

    await expect(
      handler.execute({ userId: user.id, deletedById } as DeleteUserCommand),
    ).rejects.toBeInstanceOf(UserNotFoundException);

    expect(userRepository.getUserById).toHaveBeenCalledWith(deletedById);
    expect(roleValidator.isAdmin).not.toHaveBeenCalled();
    expect(userRepository.deleteUser).not.toHaveBeenCalled();
  });

  it('throws ForbiddenToDeleteUserException when requester is not an admin', async () => {
    const user = createUserFixture();
    const requester = createUserFixture({ role: UserRole.DOCTOR });
    userRepository.getUserById.mockImplementation((id: string) => {
      if (id === user.id) return Promise.resolve(user);
      if (id === requester.id) return Promise.resolve(requester);
      return Promise.resolve(null);
    });

    await expect(
      handler.execute({
        userId: user.id,
        deletedById: requester.id,
      } as DeleteUserCommand),
    ).rejects.toBeInstanceOf(ForbiddenToDeleteUserException);

    expect(roleValidator.isAdmin).toHaveBeenCalledWith(requester.role);
    expect(userRepository.deleteUser).not.toHaveBeenCalled();
  });

  it('propagates repository error when deleteUser fails', async () => {
    const user = createUserFixture();
    const admin = createUserFixture({ role: UserRole.ADMIN });
    const repoError = new Error('Database error');
    userRepository.getUserById.mockImplementation((id: string) => {
      if (id === user.id) return Promise.resolve(user);
      if (id === admin.id) return Promise.resolve(admin);
      return Promise.resolve(null);
    });
    userRepository.deleteUser.mockRejectedValueOnce(repoError);

    await expect(
      handler.execute({
        userId: user.id,
        deletedById: admin.id,
      } as DeleteUserCommand),
    ).rejects.toBe(repoError);

    expect(userRepository.deleteUser).toHaveBeenCalledWith(user.id);
  });
});
