import { JwtService } from '@nestjs/jwt';
import { TokenCreatorImpl } from '../../../application/token-creator/token-creator.impl';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtConfigGetter } from '../../../../core/config/configs/jwt';
import { createUserFixture } from '../../../../users/__tests__/fixtures/user.fixture';

describe(TokenCreatorImpl.name, () => {
  let tokenCreator: TokenCreatorImpl;
  const jwtService: Pick<jest.Mocked<JwtService>, 'sign'> = {
    sign: jest
      .fn()
      .mockImplementationOnce(() => 'access-jwt')
      .mockImplementationOnce(() => 'refresh-jwt'),
  };
  const jwtConfigGetter: Pick<jest.Mocked<JwtConfigGetter>, 'get'> = {
    get: jest.fn().mockReturnValueOnce({
      secret: 'secret',
      accessTokenExpiresInMinutes: 60,
      refreshTokenExpiresInDays: 7,
    }),
  };

  beforeEach(async () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01T00:00:00.000Z'));
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenCreatorImpl,
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: JwtConfigGetter,
          useValue: jwtConfigGetter,
        },
      ],
    }).compile();

    tokenCreator = module.get(TokenCreatorImpl);
  });

  describe('createTokens', () => {
    it('creates access and refresh tokens with correct values and expiration offsets based on config', () => {
      const user = createUserFixture();
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
      const user = createUserFixture();
      jwtConfigGetter.get.mockReturnValue({
        secret: 's',
        accessTokenExpiresInMinutes: 0,
        refreshTokenExpiresInDays: 0,
      });
      const tokenCreatorWithZeroExpiry = new TokenCreatorImpl(
        jwtService as unknown as JwtService,
        jwtConfigGetter as unknown as JwtConfigGetter,
      );

      const result = tokenCreatorWithZeroExpiry.createTokens(user);

      const now = new Date();
      expect(result.accessTokenExpiresIn.getTime()).toBe(now.getTime());
      expect(result.refreshTokenExpiresIn.getTime()).toBe(now.getTime());
    });

    it('propagates errors thrown by JwtService.sign during token creation', () => {
      const error = new Error('sign failure');
      jwtService.sign.mockImplementation(() => {
        throw error;
      });
      const user = createUserFixture();

      expect(() => tokenCreator.createTokens(user)).toThrow(error);
    });
  });
});
