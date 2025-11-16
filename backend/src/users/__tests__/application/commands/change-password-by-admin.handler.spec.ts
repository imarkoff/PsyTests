import { ChangePasswordByAdminHandler } from '../../../application/commands/change-password-by-admin/change-password-by-admin.handler';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found.exception';
import { ForbiddenToChangePasswordException } from '../../../domain/exceptions/forbidden-to-change-password.exception';
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { Test } from '@nestjs/testing';
import { RoleValidator } from '../../../../core/validations/role-validator/role-validator.interface';
import { randomUUID, UUID } from 'node:crypto';
import { User } from '../../../domain/entities/user.entity';
import { UserRole } from '../../../../shared/enums/user-role.enum';
import { PasswordService } from '../../../../core/auth/password/password.interface';
import { Buffer } from 'node:buffer';
import { ChangePasswordByAdminCommand } from '../../../application/commands/change-password-by-admin/change-password-by-admin.command';
import { createUserFixture } from '../../fixtures/user.fixture';

describe(ChangePasswordByAdminHandler.name, () => {
  let handler: ChangePasswordByAdminHandler;

  const userRepository: Pick<
    jest.Mocked<UserRepository>,
    'getUserById' | 'updateUser'
  > = {
    getUserById: jest.fn(),
    updateUser: jest.fn(),
  };
  const roleValidator: Pick<jest.Mocked<RoleValidator>, 'isAdmin'> = {
    isAdmin: jest
      .fn()
      .mockImplementation((role: UserRole) => role === UserRole.ADMIN),
  };
  const passwordService: Pick<jest.Mocked<PasswordService>, 'hashPassword'> = {
    hashPassword: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        {
          provide: UserRepository,
          useValue: userRepository,
        },
        {
          provide: RoleValidator,
          useValue: roleValidator,
        },
        {
          provide: PasswordService,
          useValue: passwordService,
        },
        ChangePasswordByAdminHandler,
      ],
    }).compile();

    handler = module.get(ChangePasswordByAdminHandler);
  });

  it('changes the password when admin and user exist and admin has admin role', async () => {
    const user = createUserFixture();
    const changedBy = createUserFixture({ role: UserRole.ADMIN });
    const newPassword = 'new-password';
    const hashedNewPassword = Buffer.from('hashed-new-secret');
    userRepository.getUserById.mockImplementation(
      (id: UUID): Promise<User> =>
        id === user.id ? Promise.resolve(user) : Promise.resolve(changedBy),
    );
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
    const changedBy = createUserFixture({ role: UserRole.ADMIN });
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
    const user = createUserFixture();
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
    const user = createUserFixture();
    const changedBy = createUserFixture({ role: UserRole.DOCTOR });
    const newPassword = 'new-password';
    userRepository.getUserById.mockImplementation((id: UUID) =>
      id === user.id ? Promise.resolve(user) : Promise.resolve(changedBy),
    );

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
