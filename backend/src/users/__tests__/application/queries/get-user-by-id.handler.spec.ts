import { GetUserByIdHandler } from '../../../application/queries/get-user-by-id/get-user-by-id.handler';
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { Test } from '@nestjs/testing';
import { UserMapper } from '../../../application/mappers/user.mapper';
import { GetUserByIdQuery } from '../../../application/queries/get-user-by-id/get-user-by-id.query';
import { randomUUID } from 'node:crypto';
import { createUserFixture } from '../../fixtures/user.fixture';

describe(GetUserByIdHandler.name, () => {
  let handler: GetUserByIdHandler;
  const userRepository: Pick<jest.Mocked<UserRepository>, 'getUserById'> = {
    getUserById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        GetUserByIdHandler,
        {
          provide: UserRepository,
          useValue: userRepository,
        },
      ],
    }).compile();

    handler = module.get(GetUserByIdHandler);
  });

  it('returns user dto when user is found', async () => {
    const mockUser = createUserFixture();
    userRepository.getUserById.mockResolvedValue(mockUser);

    const result = await handler.execute({
      userId: mockUser.id,
    } as GetUserByIdQuery);

    expect(result).toEqual(UserMapper.toDto(mockUser));
    expect(userRepository.getUserById).toHaveBeenCalledWith(mockUser.id);
  });

  it('returns null when user is not found', async () => {
    const userId = randomUUID();
    userRepository.getUserById.mockResolvedValue(null);

    const result = await handler.execute({ userId } as GetUserByIdQuery);

    expect(result).toBeNull();
    expect(userRepository.getUserById).toHaveBeenCalledWith(userId);
  });
});
