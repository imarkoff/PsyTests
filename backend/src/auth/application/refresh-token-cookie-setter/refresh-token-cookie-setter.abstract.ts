import express from 'express';

export abstract class RefreshTokenCookieSetter {
  /**
   * Sets the refresh token cookie in the response.
   * @param res - Express Response object
   * @param token - The refresh token string
   * @param expires - Expiration date of the cookie
   */
  abstract setRefreshTokenCookie(
    res: express.Response,
    token: string,
    expires: Date,
  ): void;

  /**
   * Clears the refresh token cookie from the response.
   * @param res - Express Response object
   */
  abstract clearRefreshTokenCookie(res: express.Response): void;
}
