/* eslint-disable @typescript-eslint/unbound-method */
import { GetUserByIdHandler } from '../../../application/queries/get-user-by-id/get-user-by-id.handler';
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { Test } from '@nestjs/testing';
import { createUserPersistence } from '../../../../__tests__/fixtures/user.fixture';
import { User } from '../../../domain/entities/user.entity';
import { UserMapper } from '../../../application/mappers/user.mapper';
import { GetUserByIdQuery } from '../../../application/queries/get-user-by-id/get-user-by-id.query';
import { randomUUID } from 'node:crypto';

describe(GetUserByIdHandler.name, () => {
  let handler: GetUserByIdHandler;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetUserByIdHandler,
        {
          provide: UserRepository,
          useValue: {
            getUserById: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get(GetUserByIdHandler);
    userRepository = module.get(UserRepository);
  });

  it('returns user dto when user is found', async () => {
    const mockUser = User.fromPersistence(createUserPersistence());
    userRepository.getUserById.mockResolvedValue(mockUser);

    const result = await handler.execute({
      userId: mockUser.id,
    } as GetUserByIdQuery);

    expect(result).toEqual(UserMapper.toDto(mockUser));
    expect(userRepository.getUserById).toHaveBeenCalledWith(mockUser.id);
  });

  it('returns null when user is not found', async () => {
    const userId = randomUUID();

    const result = await handler.execute({ userId } as GetUserByIdQuery);

    expect(result).toBeNull();
    expect(userRepository.getUserById).toHaveBeenCalledWith(userId);
  });
});
