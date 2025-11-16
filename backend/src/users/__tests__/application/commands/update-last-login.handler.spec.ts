import { UpdateLastLoginHandler } from '../../../application/commands/update-last-login/update-last-login.handler';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found.exception';
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { Test } from '@nestjs/testing';
import { UpdateLastLoginCommand } from '../../../application/commands/update-last-login/update-last-login.command';
import { randomUUID } from 'node:crypto';
import { createUserFixture } from '../../fixtures/user.fixture';

describe(UpdateLastLoginHandler.name, () => {
  let handler: UpdateLastLoginHandler;
  const userRepository: Pick<
    jest.Mocked<UserRepository>,
    'getUserById' | 'updateUser'
  > = {
    getUserById: jest.fn(),
    updateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UpdateLastLoginHandler,
        {
          provide: UserRepository,
          useValue: userRepository,
        },
      ],
    }).compile();

    handler = module.get(UpdateLastLoginHandler);
  });

  it('updates last login timestamp when user exists', async () => {
    const user = createUserFixture({ lastLoginAt: null });
    userRepository.getUserById.mockResolvedValue(user);

    await handler.execute({ userId: user.id } as UpdateLastLoginCommand);

    expect(userRepository.getUserById).toHaveBeenCalledWith(user.id);
    expect(user.lastLoginAt).toBeInstanceOf(Date);
    expect(userRepository.updateUser).toHaveBeenCalledWith(user);
  });

  it('throws UserNotFoundException when user does not exist', async () => {
    const userId = randomUUID();

    await expect(
      handler.execute({ userId } as UpdateLastLoginCommand),
    ).rejects.toBeInstanceOf(UserNotFoundException);

    expect(userRepository.getUserById).toHaveBeenCalledWith(userId);
    expect(userRepository.updateUser).not.toHaveBeenCalled();
  });

  it('propagates repository error when updateUser fails', async () => {
    const user = createUserFixture({ lastLoginAt: null });
    userRepository.getUserById.mockResolvedValue(user);
    const repoError = new Error('update-failed');
    userRepository.updateUser.mockRejectedValue(repoError);

    await expect(
      handler.execute({ userId: user.id } as UpdateLastLoginCommand),
    ).rejects.toBe(repoError);

    expect(user.lastLoginAt).toBeInstanceOf(Date);
    expect(userRepository.updateUser).toHaveBeenCalledWith(user);
  });
});
