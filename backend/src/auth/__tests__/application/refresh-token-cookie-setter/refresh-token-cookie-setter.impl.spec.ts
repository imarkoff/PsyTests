import { RefreshTokenCookieSetterImpl } from '../../../application/refresh-token-cookie-setter/refresh-token-cookie-setter.impl';
import type { Response } from 'express';

describe('RefreshTokenCookieSetterImpl', () => {
  let service: RefreshTokenCookieSetterImpl;
  let res: Response;
  let cookieMock: jest.MockedFunction<Response['cookie']>;
  let clearCookieMock: jest.MockedFunction<Response['clearCookie']>;

  beforeEach(() => {
    service = new RefreshTokenCookieSetterImpl();
    cookieMock = jest.fn();
    clearCookieMock = jest.fn();
    res = {
      cookie: cookieMock,
      clearCookie: clearCookieMock,
    } as unknown as Response;
  });

  describe('setRefreshTokenCookie', () => {
    it('sets refresh token cookie with correct name and options including expires', () => {
      const token = 'refresh-token';
      const expires = new Date('2030-01-01T00:00:00.000Z');

      service.setRefreshTokenCookie(res, token, expires);

      expect(cookieMock).toHaveBeenCalledWith(
        'refreshToken',
        token,
        expect.objectContaining({
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          expires,
        }),
      );
      expect(clearCookieMock).not.toHaveBeenCalled();
    });

    it('passes the exact expires instance to the cookie call', () => {
      const token = 'token';
      const expires = new Date(1660000000123);

      service.setRefreshTokenCookie(res, token, expires);

      expect(cookieMock).toHaveBeenCalledWith(
        expect.anything(),
        token,
        expect.objectContaining({
          expires: expires,
        }),
      );
    });

    it('does not persist expires between consecutive setRefreshTokenCookie calls', () => {
      const token = 'token';
      const expires1 = new Date(1660000000000);
      const expires2 = new Date(1670000000000);

      service.setRefreshTokenCookie(res, token, expires1);
      service.setRefreshTokenCookie(res, token, expires2);

      expect(cookieMock).toHaveBeenCalledWith(
        expect.anything(),
        token,
        expect.objectContaining({
          expires: expires1,
        }),
      );
      expect(cookieMock).toHaveBeenCalledWith(
        expect.anything(),
        token,
        expect.objectContaining({
          expires: expires2,
        }),
      );
    });
  });

  describe('clearRefreshTokenCookie', () => {
    it('clears refresh token cookie using same cookie options', () => {
      service.clearRefreshTokenCookie(res);

      expect(clearCookieMock).toHaveBeenCalledWith('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
      expect(cookieMock).not.toHaveBeenCalled();
    });
  });
});
