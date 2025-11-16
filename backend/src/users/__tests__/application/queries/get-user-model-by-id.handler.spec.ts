import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { GetUserModelByIdHandler } from '../../../application/queries/get-user-model-by-id/get-user-model-by-id.handler';
import { GetUserModelByIdQuery } from '../../../application/queries/get-user-model-by-id/get-user-model-by-id.query';
import { createUserFixture } from '../../fixtures/user.fixture';

describe(GetUserModelByIdHandler.name, () => {
  let handler: GetUserModelByIdHandler;
  const userRepository: Pick<jest.Mocked<UserRepository>, 'getUserById'> = {
    getUserById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        GetUserModelByIdHandler,
        {
          provide: UserRepository,
          useValue: userRepository,
        },
      ],
    }).compile();

    handler = module.get(GetUserModelByIdHandler);
  });

  it('returns user dto when user is found', async () => {
    const mockUser = createUserFixture();
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
