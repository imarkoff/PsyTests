import { JwtService } from '@nestjs/jwt';
import { TokenCreatorImpl } from '../../../application/token-creator/token-creator.impl';
import { User } from '../../../../users/domain/entities/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { createUserPersistence } from '../../../../__tests__/fixtures/user.fixture';
import { JwtConfigGetter } from '../../../../core/config/configs/jwt';

describe(TokenCreatorImpl.name, () => {
  jest.useFakeTimers().setSystemTime(new Date('2020-01-01T00:00:00.000Z'));

  let jwtService: JwtService;
  let jwtConfigGetter: JwtConfigGetter;
  let tokenCreator: TokenCreatorImpl;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenCreatorImpl,
        {
          provide: JwtService,
          useValue: {
            sign: jest
              .fn()
              .mockImplementationOnce(() => 'access-jwt')
              .mockImplementationOnce(() => 'refresh-jwt'),
          },
        },
        {
          provide: JwtConfigGetter,
          useValue: {
            get: jest.fn().mockReturnValue({
              secret: 'secret',
              accessTokenExpiresInMinutes: 60,
              refreshTokenExpiresInDays: 7,
            }),
          },
        },
      ],
    }).compile();

    jwtService = module.get(JwtService);
    jwtConfigGetter = module.get(JwtConfigGetter);
    tokenCreator = module.get(TokenCreatorImpl);
  });

  describe('createTokens', () => {
    it('creates access and refresh tokens with correct values and expiration offsets based on config', () => {
      const user = User.fromPersistence(createUserPersistence());
      const expectedAccessExpiry = new Date('2020-01-01T00:00:00.000Z');
      const expectedRefreshExpiry = new Date('2020-01-01T00:00:00.000Z');

      const result = tokenCreator.createTokens(user);

      expect(result.accessToken).toBe('access-jwt');
      expect(result.refreshToken).toBe('refresh-jwt');
      expectedAccessExpiry.setMinutes(expectedAccessExpiry.getMinutes() + 60);
      expect(result.accessTokenExpiresIn.toISOString()).toBe(
        expectedAccessExpiry.toISOString(),
      );
      expectedRefreshExpiry.setDate(expectedRefreshExpiry.getDate() + 7);
      expect(result.refreshTokenExpiresIn.toISOString()).toBe(
        expectedRefreshExpiry.toISOString(),
      );
    });

    it('returns expirations equal to now when configured expirations are zero', () => {
      const user = User.fromPersistence(createUserPersistence());
      jwtConfigGetter.get = jest.fn().mockReturnValue({
        secret: 's',
        accessTokenExpiresInMinutes: 0,
        refreshTokenExpiresInDays: 0,
      });
      tokenCreator = new TokenCreatorImpl(jwtService, jwtConfigGetter);

      const result = tokenCreator.createTokens(user);

      const now = new Date();
      expect(result.accessTokenExpiresIn.getTime()).toBe(now.getTime());
      expect(result.refreshTokenExpiresIn.getTime()).toBe(now.getTime());
    });

    it('propagates errors thrown by JwtService.sign during token creation', () => {
      jwtService.sign = jest.fn().mockImplementation(() => {
        throw new Error('sign failure');
      });
      const user = User.fromPersistence(createUserPersistence());

      expect(() => tokenCreator.createTokens(user)).toThrow('sign failure');
    });
  });
});
