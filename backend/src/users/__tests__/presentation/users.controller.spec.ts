/* eslint-disable @typescript-eslint/unbound-method */
import { UsersController } from '../../presentation/users.controller';
import { UsersOrchestrator } from '../../application/services/users-orchestrator/users-orchestrator.abstract';
import { Test } from '@nestjs/testing';
import { createUserPersistence } from '../../../__tests__/fixtures/user.fixture';
import { User } from '../../domain/entities/user.entity';
import { UserMapper } from '../../application/mappers/user.mapper';
import { randomUUID } from 'node:crypto';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';

describe(UsersController.name, () => {
  let controller: UsersController;
  let usersOrchestrator: jest.Mocked<UsersOrchestrator>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersOrchestrator,
          useValue: {
            getUserById: jest.fn(),
          },
        },
      ],
    }).compile();
    controller = module.get(UsersController);
    usersOrchestrator = module.get(UsersOrchestrator);
  });

  describe(UsersController.prototype.getCurrentUser.name, () => {
    it('returns user dto for authenticated user', () => {
      const user = User.fromPersistence(createUserPersistence());
      const expectedDto = UserMapper.toDto(user);

      const result = controller.getCurrentUser(user);

      expect(result).toEqual(expectedDto);
    });
  });

  describe('getUserById', () => {
    it('returns user when user is found by id', async () => {
      const mockUser = UserMapper.toDto(
        User.fromPersistence(createUserPersistence()),
      );
      usersOrchestrator.getUserById.mockResolvedValue(mockUser);

      const result = await controller.getUserById(mockUser.id);

      expect(result).toEqual(mockUser);
      expect(usersOrchestrator.getUserById).toHaveBeenCalledWith(mockUser.id);
    });

    it('throws exception when user is not found by id', async () => {
      const userId = randomUUID();
      usersOrchestrator.getUserById.mockRejectedValue(
        new UserNotFoundException(userId),
      );

      await expect(controller.getUserById(userId)).rejects.toThrow(
        UserNotFoundException,
      );
      expect(usersOrchestrator.getUserById).toHaveBeenCalledWith(userId);
    });
  });
});
