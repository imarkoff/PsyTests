import { Response } from 'express';
import { RefreshTokenCookieSetter } from './refresh-token-cookie-setter.abstract';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RefreshTokenCookieSetterImpl implements RefreshTokenCookieSetter {
  private readonly logger = new Logger(RefreshTokenCookieSetter.name);
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
    this.logger.debug(
      `Set refresh token cookie with expiration: ${expires.toISOString()}`,
    );
  }
  clearRefreshTokenCookie(res: Response): void {
    res.clearCookie(this.cookieName, this.cookieOptions);
    this.logger.debug('Cleared refresh token cookie');
  }
}
