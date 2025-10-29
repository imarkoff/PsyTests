import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import type { Response } from 'express';
import { map, Observable } from 'rxjs';
import { CreatedSession } from '../../domain/types/created-session.type';
import { CreatedSessionDto } from '../../presentation/dtos/created-session.dto';
import { RefreshTokenCookieSetter } from '../../application/refresh-token-cookie-setter/refresh-token-cookie-setter.abstract';

/**
 * Interceptor that sets the refresh token cookie in the response
 * when a new session is created.
 * It removes the refresh token from the response body.
 *
 * @example
 * ```typescript
 * // In a controller method:
 * @UseInterceptors(SetRefreshTokenInterceptor)
 * createSession(...): CreatedSession {
 *  // Logic to create a session and return tokens
 *  return {
 *    accessToken, accessTokenExpiresIn,
 *    refreshToken, refreshTokenExpiresIn
 *  };
 * }
 * ```
 */
@Injectable()
export class SetRefreshTokenInterceptor implements NestInterceptor {
  private readonly logger = new Logger(SetRefreshTokenInterceptor.name);

  constructor(private readonly cookieService: RefreshTokenCookieSetter) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<CreatedSession>,
  ): Observable<CreatedSessionDto> {
    const res = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        if (data.refreshToken) {
          this.cookieService.setRefreshTokenCookie(
            res,
            data.refreshToken,
            data.refreshTokenExpiresIn,
          );
          this.logger.debug('Refresh token cookie set successfully');
        } else {
          this.logger.warn(
            'No refresh token found in the created session to set cookie. Returning access token only.',
          );
        }

        return {
          accessToken: data.accessToken,
          accessTokenExpiresIn: data.accessTokenExpiresIn,
        };
      }),
    );
  }
}
