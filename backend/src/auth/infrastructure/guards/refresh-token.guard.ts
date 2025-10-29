import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PayloadValidator } from '../../application/payload-validator/payload-validator.abstract';
import { TokenPayload } from '../../domain/types/token-payload.type';
import { ConfigService } from '@nestjs/config';
import { JwtConfig } from '../../../core/config/jwt.config';
import { RefreshTokenNotFoundException } from '../../domain/exceptions/refresh-token-not-found.exception';

/**
 * Guard that validates the refresh token from cookies.
 * If valid, attaches the user payload to the request object.
 */
@Injectable()
export class RefreshTokenGuard implements CanActivate {
  private readonly jwtConfig: JwtConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly payloadValidator: PayloadValidator,
  ) {
    this.jwtConfig = this.configService.get<JwtConfig>('jwt')!;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const refreshToken = (req.cookies as Record<string, string> | undefined)
      ?.refreshToken;

    if (!refreshToken) throw new RefreshTokenNotFoundException();

    const payload = this.jwtService.verify<TokenPayload>(refreshToken, {
      secret: this.jwtConfig.secret,
    });

    req.user = await this.payloadValidator.validatePayload(payload);

    return true;
  }
}
