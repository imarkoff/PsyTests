/* eslint-disable @typescript-eslint/unbound-method */
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { Test } from '@nestjs/testing';
import { createUserPersistence } from '../../../../__tests__/fixtures/user.fixture';
import { User } from '../../../domain/entities/user.entity';
import { randomUUID } from 'node:crypto';
import { GetUserModelByIdHandler } from '../../../application/queries/get-user-model-by-id/get-user-model-by-id.handler';
import { GetUserModelByIdQuery } from '../../../application/queries/get-user-model-by-id/get-user-model-by-id.query';

describe(GetUserModelByIdHandler.name, () => {
  let handler: GetUserModelByIdHandler;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetUserModelByIdHandler,
        {
          provide: UserRepository,
          useValue: {
            getUserById: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get(GetUserModelByIdHandler);
    userRepository = module.get(UserRepository);
  });

  it('returns user dto when user is found', async () => {
    const mockUser = User.fromPersistence(createUserPersistence());
    userRepository.getUserById.mockResolvedValue(mockUser);

    const result = await handler.execute({
      userId: mockUser.id,
    } as GetUserModelByIdQuery);

    expect(result).toEqual(mockUser);
    expect(userRepository.getUserById).toHaveBeenCalledWith(mockUser.id);
  });

  it('returns null when user is not found', async () => {
    const userId = randomUUID();
    userRepository.getUserById.mockResolvedValue(null);

    const result = await handler.execute({ userId } as GetUserModelByIdQuery);

    expect(result).toBeNull();
    expect(userRepository.getUserById).toHaveBeenCalledWith(userId);
  });
});
