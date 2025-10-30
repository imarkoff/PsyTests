/* eslint-disable @typescript-eslint/unbound-method */
import { UsersOrchestratorImpl } from '../../../application/services/users-orchestrator/users-orchestrator.impl';
import { QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { createUserPersistence } from '../../../../__tests__/fixtures/user.fixture';
import { User } from '../../../domain/entities/user.entity';
import { GetUserByIdQuery } from '../../../application/queries/get-user-by-id/get-user-by-id.query';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found.exception';
import { randomUUID } from 'node:crypto';

describe(UsersOrchestratorImpl.name, () => {
  let orchestrator: UsersOrchestratorImpl;
  let queryBus: jest.Mocked<QueryBus>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersOrchestratorImpl,
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    orchestrator = module.get(UsersOrchestratorImpl);
    queryBus = module.get(QueryBus);
  });

  describe(UsersOrchestratorImpl.prototype.getUserById.name, () => {
    it('returns user when user is found', async () => {
      const user = User.fromPersistence(createUserPersistence());
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
