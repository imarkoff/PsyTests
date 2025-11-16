import { RefreshTokenGuard } from '../../../infrastructure/guards/refresh-token.guard';
import { JwtService } from '@nestjs/jwt';
import { PayloadValidator } from '../../../application/payload-validator/payload-validator.abstract';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenNotFoundException } from '../../../domain/exceptions/refresh-token-not-found.exception';
import { TokenPayload } from '../../../domain/types/token-payload.type';
import type { Request } from 'express';
import { randomUUID } from 'node:crypto';
import { UserRole } from '../../../../shared/enums/user-role.enum';
import { createUserFixture } from '../../../../users/__tests__/fixtures/user.fixture';
import { JwtConfigGetter } from '../../../../core/config/configs/jwt';
import { Test } from '@nestjs/testing';

describe('RefreshTokenGuard', () => {
  let guard: RefreshTokenGuard;

  const configGetter: Pick<jest.Mocked<JwtConfigGetter>, 'get'> = {
    get: jest.fn().mockReturnValue({
      secret: 'test-secret',
      accessTokenExpiresInMinutes: 15,
      refreshTokenExpiresInDays: 7,
    }),
  };
  const jwtService: Pick<jest.Mocked<JwtService>, 'verify'> = {
    verify: jest.fn(),
  };
  const payloadValidator: Pick<
    jest.Mocked<PayloadValidator>,
    'validatePayload'
  > = {
    validatePayload: jest.fn(),
  };
  const mockRequest: Request = {
    cookies: {},
    user: undefined,
  } as unknown as Request;
  const mockContext: jest.Mocked<ExecutionContext> = {
    switchToHttp: jest
      .fn()
      .mockReturnValue({ getRequest: jest.fn().mockReturnValue(mockRequest) }),
  } as unknown as jest.Mocked<ExecutionContext>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RefreshTokenGuard,
        { provide: JwtConfigGetter, useValue: configGetter },
        { provide: JwtService, useValue: jwtService },
        { provide: PayloadValidator, useValue: payloadValidator },
      ],
    }).compile();

    guard = module.get(RefreshTokenGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('returns true and attaches user to request when token is valid', async () => {
      const refreshToken = 'valid-token';
      const uuid = randomUUID();
      const payload: TokenPayload = { sub: uuid, role: UserRole.PATIENT };
      const user = createUserFixture({ id: uuid });

      mockRequest.cookies.refreshToken = refreshToken;
      jwtService.verify.mockReturnValue(payload);
      payloadValidator.validatePayload.mockResolvedValue(user);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(jwtService.verify).toHaveBeenCalledWith(refreshToken, {
        secret: 'test-secret',
      });
      expect(payloadValidator.validatePayload).toHaveBeenCalledWith(payload);
      expect(mockRequest.user).toEqual(user);
    });

    it('throws RefreshTokenNotFoundException if cookies are not present', async () => {
      mockRequest.cookies.refreshToken = undefined;
      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        RefreshTokenNotFoundException,
      );
    });

    it('throws RefreshTokenNotFoundException if refresh token is not in cookies', async () => {
      mockRequest.cookies = {};
      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        RefreshTokenNotFoundException,
      );
    });

    it('throws an error if jwtService verification fails', async () => {
      mockRequest.cookies.refreshToken = 'invalid-token';
      const error = new UnauthorizedException('Invalid token');
      jwtService.verify.mockImplementation(() => {
        throw error;
      });

      await expect(guard.canActivate(mockContext)).rejects.toThrow(error);
    });

    it('throws an error if payload validation fails', async () => {
      const refreshToken = 'valid-token';
      const payload: TokenPayload = {
        sub: randomUUID(),
        role: UserRole.PATIENT,
      };
      mockRequest.cookies.refreshToken = refreshToken;
      jwtService.verify.mockReturnValue(payload);
      const error = new UnauthorizedException('Invalid user');
      payloadValidator.validatePayload.mockRejectedValue(error);

      await expect(guard.canActivate(mockContext)).rejects.toThrow(error);
    });
  });
});
