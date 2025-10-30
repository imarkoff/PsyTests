/* eslint-disable @typescript-eslint/unbound-method */
import { UpdateLastLoginHandler } from '../../../application/commands/update-last-login/update-last-login.handler';
import { PhoneIsAlreadyTakenException } from '../../../domain/exceptions/phone-is-already-taken.exception';
import { UpdateUserHandler } from '../../../application/commands/update-user/update-user.handler';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found.exception';
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { Test } from '@nestjs/testing';
import { createUserPersistence } from '../../../../__tests__/fixtures/user.fixture';
import { User } from '../../../domain/entities/user.entity';
import { createUserUpdateDtoFixture } from '../../fixtures/user-update-dto.fixture';
import { UpdateUserCommand } from '../../../application/commands/update-user/update-user.command';
import { randomUUID } from 'node:crypto';

describe(UpdateLastLoginHandler.name, () => {
  let handler: UpdateUserHandler;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UpdateUserHandler,
        {
          provide: UserRepository,
          useValue: {
            getUserById: jest.fn(),
            getUserByPhone: jest.fn(),
            updateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get(UpdateUserHandler);
    userRepository = module.get(UserRepository);
  });

  it('updates user when phone is unchanged and user exists', async () => {
    const user = User.fromPersistence(createUserPersistence());
    const updateData = createUserUpdateDtoFixture({
      phone: user.phone,
    });
    userRepository.getUserById.mockResolvedValue(user);

    const result = await handler.execute({
      userId: user.id,
      updateData,
    } as UpdateUserCommand);

    expect(userRepository.getUserById).toHaveBeenCalledWith(user.id);
    expect(userRepository.getUserByPhone).not.toHaveBeenCalled();
    expect(userRepository.updateUser).toHaveBeenCalledWith(user);
    expect(result.phone).toBe(updateData.phone);
    expect(result.name).toBe(updateData.name);
    expect(result.surname).toBe(updateData.surname);
  });

  it('updates user when phone is changed and new phone is unique', async () => {
    const user = User.fromPersistence(createUserPersistence());
    const updateData = createUserUpdateDtoFixture();
    userRepository.getUserById.mockResolvedValue(user);

    const result = await handler.execute({
      userId: user.id,
      updateData,
    } as UpdateUserCommand);

    expect(userRepository.getUserById).toHaveBeenCalledWith(user.id);
    expect(userRepository.getUserByPhone).toHaveBeenCalledWith(
      updateData.phone,
    );
    expect(userRepository.updateUser).toHaveBeenCalledWith(user);
    expect(result.phone).toBe(updateData.phone);
    expect(result.name).toBe(updateData.name);
  });

  it('throws UserNotFoundException when user does not exist', async () => {
    const userId = randomUUID();
    const updateData = createUserUpdateDtoFixture();

    await expect(
      handler.execute({ userId, updateData } as UpdateUserCommand),
    ).rejects.toBeInstanceOf(UserNotFoundException);

    expect(userRepository.getUserById).toHaveBeenCalledWith(userId);
    expect(userRepository.getUserByPhone).not.toHaveBeenCalled();
    expect(userRepository.updateUser).not.toHaveBeenCalled();
  });

  it('throws PhoneIsAlreadyTakenException when new phone belongs to another user', async () => {
    const user = User.fromPersistence(createUserPersistence());
    const takenPhone = '+44444444444';
    const userWithTakenPhone = User.fromPersistence(
      createUserPersistence({ phone: takenPhone }),
    );
    const updateData = createUserUpdateDtoFixture({ phone: takenPhone });
    userRepository.getUserById.mockResolvedValue(user);
    userRepository.getUserByPhone.mockResolvedValue(userWithTakenPhone);

    await expect(
      handler.execute({ userId: user.id, updateData } as UpdateUserCommand),
    ).rejects.toBeInstanceOf(PhoneIsAlreadyTakenException);

    expect(userRepository.getUserById).toHaveBeenCalledWith(user.id);
    expect(userRepository.getUserByPhone).toHaveBeenCalledWith(takenPhone);
    expect(userRepository.updateUser).not.toHaveBeenCalled();
  });
});
