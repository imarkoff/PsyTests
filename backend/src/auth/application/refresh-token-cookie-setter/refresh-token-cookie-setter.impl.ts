import { Response } from 'express';
import { RefreshTokenCookieSetter } from './refresh-token-cookie-setter.abstract';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RefreshTokenCookieSetterImpl implements RefreshTokenCookieSetter {
  private readonly cookieName = 'refreshToken';
  private readonly cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict' as const,
  };

  setRefreshTokenCookie(res: Response, token: string, expires: Date): void {
    res.cookie(this.cookieName, token, {
      ...this.cookieOptions,
      expires: expires,
    });
  }
  clearRefreshTokenCookie(res: Response): void {
    res.clearCookie(this.cookieName, this.cookieOptions);
  }
}
