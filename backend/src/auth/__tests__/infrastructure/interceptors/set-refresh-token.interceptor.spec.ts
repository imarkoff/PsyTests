/* eslint-disable @typescript-eslint/unbound-method */
import { SetRefreshTokenInterceptor } from '../../../infrastructure/interceptors/set-refresh-token.interceptor';
import { RefreshTokenCookieSetter } from '../../../application/refresh-token-cookie-setter/refresh-token-cookie-setter.abstract';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { CreatedSession } from '../../../domain/types/created-session.type';
import type { Response } from 'express';
import { Test } from '@nestjs/testing';

describe('SetRefreshTokenInterceptor', () => {
  let interceptor: SetRefreshTokenInterceptor;
  let mockCookieService: jest.Mocked<RefreshTokenCookieSetter>;
  let mockContext: ExecutionContext;
  let mockResponse: Response;
  let mockNext: CallHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SetRefreshTokenInterceptor,
        {
          provide: RefreshTokenCookieSetter,
          useValue: {
            setRefreshTokenCookie: jest.fn(),
          },
        },
      ],
    }).compile();

    interceptor = module.get(SetRefreshTokenInterceptor);
    mockCookieService = module.get(RefreshTokenCookieSetter);

    mockResponse = {} as Response;

    mockContext = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
      }),
    } as ExecutionContext;
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe('intercept', () => {
    it('sets refresh token cookie and removes it from the response body', (done) => {
      const accessTokenExpiresIn = new Date();
      const refreshTokenExpiresIn = new Date();
      const session: CreatedSession = {
        accessToken: 'access-token',
        accessTokenExpiresIn,
        refreshToken: 'refresh-token',
        refreshTokenExpiresIn,
      };

      mockNext = {
        handle: () => of(session),
      };

      interceptor
        .intercept(mockContext, mockNext as CallHandler<CreatedSession>)
        .subscribe((result) => {
          expect(mockCookieService.setRefreshTokenCookie).toHaveBeenCalledWith(
            mockResponse,
            session.refreshToken,
            session.refreshTokenExpiresIn,
          );
          expect(result).toEqual({
            accessToken: 'access-token',
            accessTokenExpiresIn: accessTokenExpiresIn,
          });
          expect(result).not.toHaveProperty('refreshToken');
          expect(result).not.toHaveProperty('refreshTokenExpiresIn');
          done();
        });
    });

    it('does not set cookie if refresh token is not present in data', (done) => {
      const accessTokenExpiresIn = new Date();
      const session = {
        accessToken: 'access-token',
        accessTokenExpiresIn,
      } as CreatedSession;

      mockNext = {
        handle: () => of(session),
      };

      interceptor
        .intercept(mockContext, mockNext as CallHandler<CreatedSession>)
        .subscribe((result) => {
          expect(
            mockCookieService.setRefreshTokenCookie,
          ).not.toHaveBeenCalled();
          expect(result).toEqual({
            accessToken: 'access-token',
            accessTokenExpiresIn: accessTokenExpiresIn,
          });
          done();
        });
    });
  });
});
