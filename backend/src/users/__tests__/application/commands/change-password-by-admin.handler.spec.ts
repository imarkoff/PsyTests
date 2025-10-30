/* eslint-disable @typescript-eslint/unbound-method */
import { ChangePasswordByAdminHandler } from '../../../application/commands/change-password-by-admin/change-password-by-admin.handler';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found.exception';
import { ForbiddenToChangePasswordException } from '../../../domain/exceptions/forbidden-to-change-password.exception';
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { Test } from '@nestjs/testing';
import { RoleValidator } from '../../../../core/validations/role-validator/role-validator.interface';
import { randomUUID, UUID } from 'node:crypto';
import { User } from '../../../domain/entities/user.entity';
import { createUserPersistence } from '../../../../__tests__/fixtures/user.fixture';
import { UserRole } from '../../../../shared/enums/user-role.enum';
import { PasswordService } from '../../../../core/auth/password/password.interface';
import { Buffer } from 'node:buffer';
import { ChangePasswordByAdminCommand } from '../../../application/commands/change-password-by-admin/change-password-by-admin.command';

describe('ChangePasswordByAdminHandler', () => {
  let handler: ChangePasswordByAdminHandler;
  let userRepository: jest.Mocked<UserRepository>;
  let roleValidator: jest.Mocked<RoleValidator>;
  let passwordService: jest.Mocked<PasswordService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: UserRepository,
          useValue: {
            getUserById: jest.fn(),
            updateUser: jest.fn(),
          },
        },
        {
          provide: RoleValidator,
          useValue: {
            isAdmin: jest.fn(),
          },
        },
        {
          provide: PasswordService,
          useValue: {
            hashPassword: jest.fn(),
          },
        },
        ChangePasswordByAdminHandler,
      ],
    }).compile();

    handler = module.get(ChangePasswordByAdminHandler);
    userRepository = module.get(UserRepository);
    roleValidator = module.get(RoleValidator);
    passwordService = module.get(PasswordService);
  });

  it('changes the password when admin and user exist and admin has admin role', async () => {
    const user = User.fromPersistence(createUserPersistence());
    const changedBy = User.fromPersistence(
      createUserPersistence({ role: UserRole.ADMIN }),
    );
    const newPassword = 'new-password';
    const hashedNewPassword = Buffer.from('hashed-new-secret');
    userRepository.getUserById.mockImplementation(
      (id: UUID): Promise<User> =>
        id === user.id ? Promise.resolve(user) : Promise.resolve(changedBy),
    );
    roleValidator.isAdmin.mockReturnValue(true);
    passwordService.hashPassword.mockResolvedValue({
      hash: hashedNewPassword,
      salt: Buffer.from('some-salt'),
    });

    await handler.execute({
      userId: user.id,
      changedById: changedBy.id,
      newPassword,
    } as ChangePasswordByAdminCommand);

    expect(userRepository.getUserById).toHaveBeenCalledWith(user.id);
    expect(userRepository.getUserById).toHaveBeenCalledWith(changedBy.id);
    expect(passwordService.hashPassword).toHaveBeenCalledWith(newPassword);
    expect(user.password).toBe(hashedNewPassword);
    expect(userRepository.updateUser).toHaveBeenCalledWith(user);
  });

  it('throws UserNotFoundException when target user does not exist', async () => {
    const userId = randomUUID();
    const newPassword = 'irrelevant';
    const changedBy = User.fromPersistence(createUserPersistence());
    userRepository.getUserById.mockImplementation((id: UUID) =>
      id === changedBy.id ? Promise.resolve(changedBy) : Promise.resolve(null),
    );

    await expect(
      handler.execute({
        userId,
        changedById: changedBy.id,
        newPassword,
      } as ChangePasswordByAdminCommand),
    ).rejects.toBeInstanceOf(UserNotFoundException);

    expect(userRepository.getUserById).toHaveBeenCalledWith(userId);
    expect(userRepository.getUserById).not.toHaveBeenCalledWith(changedBy.id);
    expect(userRepository.updateUser).not.toHaveBeenCalled();
    expect(passwordService.hashPassword).not.toHaveBeenCalled();
  });

  it('throws UserNotFoundException when admin (changedBy) does not exist', async () => {
    const user = User.fromPersistence(createUserPersistence());
    const changedById = randomUUID();
    const newPassword = 'irrelevant';
    userRepository.getUserById.mockImplementation((id: UUID) =>
      id === user.id ? Promise.resolve(user) : Promise.resolve(null),
    );

    await expect(
      handler.execute({
        userId: user.id,
        changedById,
        newPassword,
      } as ChangePasswordByAdminCommand),
    ).rejects.toBeInstanceOf(UserNotFoundException);

    expect(userRepository.getUserById).toHaveBeenCalledWith(changedById);
    expect(roleValidator.isAdmin).not.toHaveBeenCalled();
    expect(passwordService.hashPassword).not.toHaveBeenCalled();
    expect(userRepository.updateUser).not.toHaveBeenCalled();
  });

  it('throws ForbiddenToChangePasswordException when changedBy is not an admin', async () => {
    const user = User.fromPersistence(createUserPersistence());
    const changedBy = User.fromPersistence(createUserPersistence());
    const newPassword = 'new-password';
    userRepository.getUserById.mockImplementation((id: UUID) =>
      id === user.id ? Promise.resolve(user) : Promise.resolve(changedBy),
    );
    roleValidator.isAdmin.mockReturnValue(false);

    await expect(
      handler.execute({
        userId: user.id,
        changedById: changedBy.id,
        newPassword,
      } as ChangePasswordByAdminCommand),
    ).rejects.toBeInstanceOf(ForbiddenToChangePasswordException);

    expect(roleValidator.isAdmin).toHaveBeenCalledWith(changedBy.role);
    expect(passwordService.hashPassword).not.toHaveBeenCalled();
    expect(userRepository.updateUser).not.toHaveBeenCalled();
  });
});
