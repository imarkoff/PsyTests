import { UsersController } from '../../presentation/users.controller';
import { UsersOrchestrator } from '../../application/services/users-orchestrator/users-orchestrator.abstract';
import { Test } from '@nestjs/testing';
import { UserMapper } from '../../application/mappers/user.mapper';
import { randomUUID } from 'node:crypto';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { createUserFixture } from '../fixtures/user.fixture';

describe(UsersController.name, () => {
  let controller: UsersController;
  const usersOrchestrator: Omit<jest.Mocked<UsersOrchestrator>, ''> = {
    getUserById: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersOrchestrator,
          useValue: usersOrchestrator,
        },
      ],
    }).compile();
    controller = module.get(UsersController);
  });

  describe(UsersController.prototype.getCurrentUser.name, () => {
    it('returns user dto for authenticated user', () => {
      const user = createUserFixture();
      const expectedDto = UserMapper.toDto(user);

      const result = controller.getCurrentUser(user);

      expect(result).toEqual(expectedDto);
    });
  });

  describe('getUserById', () => {
    it('returns user when user is found by id', async () => {
      const mockUser = UserMapper.toDto(createUserFixture());
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
