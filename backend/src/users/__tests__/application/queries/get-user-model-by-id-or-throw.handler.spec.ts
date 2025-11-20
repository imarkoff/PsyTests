import { GetUserModelByIdOrThrowHandler } from '../../../application/queries/get-user-model-by-id-or-throw/get-user-model-by-id-or-throw.handler';
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { Test } from '@nestjs/testing';
import { createUserFixture } from '../../fixtures/user.fixture';
import { GetUserModelByIdOrThrowQuery } from '../../../application/queries/get-user-model-by-id-or-throw/get-user-model-by-id-or-throw.query';
import { randomUUID } from 'node:crypto';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found.exception';

describe(GetUserModelByIdOrThrowHandler.name, () => {
  let handler: GetUserModelByIdOrThrowHandler;

  const repository: Pick<jest.Mocked<UserRepository>, 'getUserById'> = {
    getUserById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        GetUserModelByIdOrThrowHandler,
        {
          provide: UserRepository,
          useValue: repository,
        },
      ],
    }).compile();

    handler = module.get(GetUserModelByIdOrThrowHandler);
  });

  it('should return user model when found', async () => {
    const user = createUserFixture();
    repository.getUserById.mockResolvedValueOnce(user);

    const result = await handler.execute({
      userId: user.id,
    } as GetUserModelByIdOrThrowQuery);

    expect(result).toBe(user);
  });

  it('should throw error when user not found', async () => {
    const userId = randomUUID();
    repository.getUserById.mockResolvedValueOnce(null);

    await expect(
      handler.execute({
        userId,
      } as GetUserModelByIdOrThrowQuery),
    ).rejects.toThrow(UserNotFoundException);
  });

  it('calls repository with correct parameters', async () => {
    const user = createUserFixture();
    repository.getUserById.mockResolvedValueOnce(user);

    await handler.execute({
      userId: user.id,
    } as GetUserModelByIdOrThrowQuery);

    expect(repository.getUserById).toHaveBeenCalledTimes(1);
    expect(repository.getUserById).toHaveBeenCalledWith(user.id);
  });
});
