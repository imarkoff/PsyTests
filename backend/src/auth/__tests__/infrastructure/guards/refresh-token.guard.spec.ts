/* eslint-disable @typescript-eslint/unbound-method */
import { RefreshTokenGuard } from '../../../infrastructure/guards/refresh-token.guard';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PayloadValidator } from '../../../application/payload-validator/payload-validator.abstract';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenNotFoundException } from '../../../domain/exceptions/refresh-token-not-found.exception';
import { TokenPayload } from '../../../domain/types/token-payload.type';
import { User } from '../../../../users/domain/entities/user.entity';
import type { Request } from 'express';
import { randomUUID } from 'node:crypto';
import { UserRole } from '../../../../shared/enums/user-role.enum';
import { createUserPersistence } from '../../../../__tests__/fixtures/user.fixture';

describe('RefreshTokenGuard', () => {
  let guard: RefreshTokenGuard;
  let mockConfigService: jest.Mocked<ConfigService>;
  let mockJwtService: jest.Mocked<JwtService>;
  let mockPayloadValidator: jest.Mocked<PayloadValidator>;
  let mockContext: jest.Mocked<ExecutionContext>;
  let mockRequest: Request;

  beforeEach(() => {
    mockRequest = {
      cookies: {},
      user: undefined,
    } as unknown as Request;

    const mockHttp = {
      getRequest: jest.fn().mockReturnValue(mockRequest),
    };

    mockContext = {
      switchToHttp: jest.fn().mockReturnValue(mockHttp),
    } as unknown as jest.Mocked<ExecutionContext>;

    mockConfigService = {
      get: jest.fn().mockReturnValue({ secret: 'test-secret' }),
    } as unknown as jest.Mocked<ConfigService>;

    mockJwtService = {
      verify: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    mockPayloadValidator = {
      validatePayload: jest.fn(),
    } as unknown as jest.Mocked<PayloadValidator>;

    guard = new RefreshTokenGuard(
      mockConfigService,
      mockJwtService,
      mockPayloadValidator,
    );
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('returns true and attaches user to request when token is valid', async () => {
      const refreshToken = 'valid-token';
      const uuid = randomUUID();
      const payload: TokenPayload = { sub: uuid, role: UserRole.PATIENT };
      const user = User.fromPersistence(createUserPersistence({ id: uuid }));

      mockRequest.cookies.refreshToken = refreshToken;
      mockJwtService.verify.mockReturnValue(payload);
      mockPayloadValidator.validatePayload.mockResolvedValue(user);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(mockJwtService.verify).toHaveBeenCalledWith(refreshToken, {
        secret: 'test-secret',
      });
      expect(mockPayloadValidator.validatePayload).toHaveBeenCalledWith(
        payload,
      );
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
      mockJwtService.verify.mockImplementation(() => {
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
      mockJwtService.verify.mockReturnValue(payload);
      const error = new UnauthorizedException('Invalid user');
      mockPayloadValidator.validatePayload.mockRejectedValue(error);

      await expect(guard.canActivate(mockContext)).rejects.toThrow(error);
    });
  });
});
