/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import { SessionCreatorImpl } from '../../../application/session-creator/session-creator.impl';
import { TokenCreator } from '../../../application/token-creator/token-creator.abstract';
import { UpdateLastLoginCommand } from '../../../../users/application/commands/update-last-login/update-last-login.command';
import { User } from 'src/users/domain/entities/user.entity';
import { CreatedSession } from '../../../domain/types/created-session.type';
import { createUserPersistence } from '../../../../__tests__/fixtures/user.fixture';

describe('SessionCreatorImpl', () => {
  let service: SessionCreatorImpl;
  let commandBus: jest.Mocked<CommandBus>;
  let tokenCreator: jest.Mocked<TokenCreator>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionCreatorImpl,
        {
          provide: CommandBus,
          useValue: { execute: jest.fn() },
        },
        {
          provide: TokenCreator,
          useValue: { createTokens: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(SessionCreatorImpl);
    commandBus = module.get(CommandBus);
    tokenCreator = module.get(TokenCreator);
  });

  describe('createSession', () => {
    it('returns created session after updating last login and creating tokens', async () => {
      const user = User.fromPersistence(createUserPersistence());
      const createdSession: CreatedSession = {
        accessToken: 'at',
        accessTokenExpiresIn: new Date(Date.now() + 3600 * 1000),
        refreshToken: 'rt',
        refreshTokenExpiresIn: new Date(Date.now() + 7 * 24 * 3600 * 1000),
      };
      commandBus.execute.mockResolvedValue(undefined);
      tokenCreator.createTokens.mockReturnValue(createdSession);

      const result = await service.createSession(user);

      expect(result).toEqual(createdSession);
      expect(commandBus.execute).toHaveBeenCalledWith(
        new UpdateLastLoginCommand(user.id),
      );
      expect(tokenCreator.createTokens).toHaveBeenCalledWith(user);
    });

    it('propagates error when updating last login fails and does not call token creation', async () => {
      const user = User.fromPersistence(createUserPersistence());
      const err = new Error('db error');
      commandBus.execute.mockRejectedValue(err);

      await expect(service.createSession(user)).rejects.toThrow(err);
      expect(commandBus.execute).toHaveBeenCalledWith(
        new UpdateLastLoginCommand(user.id),
      );
      expect(tokenCreator.createTokens).not.toHaveBeenCalled();
    });

    it('propagates error when token creation fails after successful last login update', async () => {
      const user = User.fromPersistence(createUserPersistence());
      commandBus.execute.mockResolvedValue(undefined);
      const err = new Error('token error');
      tokenCreator.createTokens.mockRejectedValue(err as never);

      await expect(service.createSession(user)).rejects.toThrow(err);
      expect(commandBus.execute).toHaveBeenCalledWith(
        new UpdateLastLoginCommand(user.id),
      );
      expect(tokenCreator.createTokens).toHaveBeenCalledWith(user);
    });
  });
});
