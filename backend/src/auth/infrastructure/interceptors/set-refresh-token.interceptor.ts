import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Response } from 'express';
import { map, Observable } from 'rxjs';
import { CreatedSession } from '../../domain/types/created-session.type';
import { CreatedSessionDto } from '../../presentation/dtos/created-session.dto';
import { RefreshTokenCookieSetter } from '../../application/refresh-token-cookie-setter/refresh-token-cookie-setter.abstract';

@Injectable()
export class SetRefreshTokenInterceptor implements NestInterceptor {
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
        }

        return {
          accessToken: data.accessToken,
          accessTokenExpiresIn: data.accessTokenExpiresIn,
        };
      }),
    );
  }
}
