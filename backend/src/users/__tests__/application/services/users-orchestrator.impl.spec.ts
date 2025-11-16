import { UsersOrchestratorImpl } from '../../../application/services/users-orchestrator/users-orchestrator.impl';
import { QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { GetUserByIdQuery } from '../../../application/queries/get-user-by-id/get-user-by-id.query';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found.exception';
import { randomUUID } from 'node:crypto';
import { createUserFixture } from '../../fixtures/user.fixture';

describe(UsersOrchestratorImpl.name, () => {
  let orchestrator: UsersOrchestratorImpl;
  const queryBus: Pick<jest.Mocked<QueryBus>, 'execute'> = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersOrchestratorImpl,
        {
          provide: QueryBus,
          useValue: queryBus,
        },
      ],
    }).compile();

    orchestrator = module.get(UsersOrchestratorImpl);
  });

  describe(UsersOrchestratorImpl.prototype.getUserById.name, () => {
    it('returns user when user is found', async () => {
      const user = createUserFixture();
      queryBus.execute.mockResolvedValue(user);

      const result = await orchestrator.getUserById(user.id);

      expect(result).toEqual(user);
      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetUserByIdQuery(user.id),
      );
    });

    it('throws UserNotFoundException when user is not found', async () => {
      const userId = randomUUID();
      queryBus.execute.mockResolvedValue(null);

      await expect(orchestrator.getUserById(userId)).rejects.toThrow(
        UserNotFoundException,
      );
      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetUserByIdQuery(userId),
      );
    });
  });
});
