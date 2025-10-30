/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from '../../presentation/authentication.controller';
import { SessionCreator } from '../../application/session-creator/session-creator.abstract';
import { RefreshTokenCookieSetter } from '../../application/refresh-token-cookie-setter/refresh-token-cookie-setter.abstract';
import { User } from '../../../users/domain/entities/user.entity';
import type { Response } from 'express';
import { createUserPersistence } from '../../../__tests__/fixtures/user.fixture';
import { LocalAuthGuard } from '../../infrastructure/guards/local-auth.guard';
import { RefreshTokenGuard } from '../../infrastructure/guards/refresh-token.guard';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../../core/decorators/public.decorator';
import { SetRefreshTokenInterceptor } from '../../infrastructure/interceptors/set-refresh-token.interceptor';
import { RequestMethod } from '@nestjs/common';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let sessionCreator: SessionCreator;
  let refreshTokenSetter: RefreshTokenCookieSetter;
  let reflector: Reflector;

  const mockSessionCreator = {
    createSession: jest.fn(),
  };

  const mockRefreshTokenSetter = {
    clearRefreshTokenCookie: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        {
          provide: SessionCreator,
          useValue: mockSessionCreator,
        },
        {
          provide: RefreshTokenCookieSetter,
          useValue: mockRefreshTokenSetter,
        },
        Reflector,
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RefreshTokenGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
    sessionCreator = module.get<SessionCreator>(SessionCreator);
    refreshTokenSetter = module.get<RefreshTokenCookieSetter>(
      RefreshTokenCookieSetter,
    );
    reflector = module.get<Reflector>(Reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should create a session for the authenticated user', async () => {
      const user = User.fromPersistence(createUserPersistence());
      const session = { accessToken: 'some-access-token' };
      (sessionCreator.createSession as jest.Mock).mockResolvedValue(session);

      const result = await controller.login(user);

      expect(sessionCreator.createSession).toHaveBeenCalledWith(user);
      expect(result).toEqual(session);
    });

    it('login endpoint should have @Public, @UseGuards(LocalAuthGuard), @UseInterceptors(SetRefreshTokenInterceptor) and @Post("login")', () => {
      const isPublic = reflector.get<boolean>(IS_PUBLIC_KEY, controller.login);
      const guards = Reflect.getMetadata(
        '__guards__',
        controller.login,
      ) as any[];
      const interceptors = Reflect.getMetadata(
        '__interceptors__',
        controller.login,
      ) as any[];
      const path = Reflect.getMetadata('path', controller.login) as string;
      const method = Reflect.getMetadata('method', controller.login) as number;

      expect(isPublic).toBe(true);
      expect(guards).toEqual([LocalAuthGuard]);
      expect(interceptors).toEqual([SetRefreshTokenInterceptor]);
      expect(path).toBe('login');
      expect(method).toBe(RequestMethod.POST);
    });
  });

  describe('refreshToken', () => {
    it('should create a new session for the user from the refresh token', async () => {
      const user = User.fromPersistence(createUserPersistence());
      const newSession = { accessToken: 'new-access-token' };
      (sessionCreator.createSession as jest.Mock).mockResolvedValue(newSession);

      const result = await controller.refreshToken(user);

      expect(sessionCreator.createSession).toHaveBeenCalledWith(user);
      expect(result).toEqual(newSession);
    });

    it('refreshToken endpoint should have @Public, @UseGuards(RefreshTokenGuard), @UseInterceptors(SetRefreshTokenInterceptor) and @Post("refresh-token")', () => {
      const isPublic = reflector.get<boolean>(
        IS_PUBLIC_KEY,
        controller.refreshToken,
      );
      const guards = Reflect.getMetadata(
        '__guards__',
        controller.refreshToken,
      ) as any[];
      const interceptors = Reflect.getMetadata(
        '__interceptors__',
        controller.refreshToken,
      ) as any[];
      const path = Reflect.getMetadata(
        'path',
        controller.refreshToken,
      ) as string;
      const method = Reflect.getMetadata(
        'method',
        controller.refreshToken,
      ) as number;

      expect(isPublic).toBe(true);
      expect(guards).toEqual([RefreshTokenGuard]);
      expect(interceptors).toEqual([SetRefreshTokenInterceptor]);
      expect(path).toBe('refresh-token');
      expect(method).toBe(RequestMethod.POST);
    });
  });

  describe('logout', () => {
    it('should clear the refresh token cookie', () => {
      const mockResponse = {
        clearCookie: jest.fn(),
      } as unknown as Response;

      controller.logout(mockResponse);

      expect(refreshTokenSetter.clearRefreshTokenCookie).toHaveBeenCalledWith(
        mockResponse,
      );
    });

    it('logout endpoint should have @Public and @Post("logout")', () => {
      const isPublic = reflector.get<boolean>(IS_PUBLIC_KEY, controller.logout);
      const path = Reflect.getMetadata('path', controller.logout) as string;
      const method = Reflect.getMetadata('method', controller.logout) as number;

      expect(isPublic).toBe(true);
      expect(path).toBe('logout');
      expect(method).toBe(RequestMethod.POST);
    });
  });
});
