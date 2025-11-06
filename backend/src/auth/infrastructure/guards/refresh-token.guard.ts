import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PayloadValidator } from '../../application/payload-validator/payload-validator.abstract';
import { TokenPayload } from '../../domain/types/token-payload.type';
import { RefreshTokenNotFoundException } from '../../domain/exceptions/refresh-token-not-found.exception';
import { JwtConfig, JwtConfigGetter } from '../../../core/config/configs/jwt';

/**
 * Guard that validates the refresh token from cookies.
 * If valid, attaches the user payload to the request object.
 */
@Injectable()
export class RefreshTokenGuard implements CanActivate {
  private readonly logger = new Logger(RefreshTokenGuard.name);
  private readonly jwtConfig: JwtConfig;

  constructor(
    private readonly jwtConfigGetter: JwtConfigGetter,
    private readonly jwtService: JwtService,
    private readonly payloadValidator: PayloadValidator,
  ) {
    this.jwtConfig = this.jwtConfigGetter.get();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const refreshToken = (req.cookies as Record<string, string> | undefined)
      ?.refreshToken;

    if (!refreshToken) {
      this.logger.warn('Refresh token not found in cookies.');
      throw new RefreshTokenNotFoundException();
    }

    const payload = this.verifyPayload(refreshToken);

    req.user = await this.validateUserFromPayload(payload);

    return true;
  }

  private verifyPayload(token: string): TokenPayload {
    try {
      this.logger.log('Verifying refresh token payload.');
      return this.jwtService.verify<TokenPayload>(token, {
        secret: this.jwtConfig.secret,
      });
    } catch (error) {
      this.logger.warn(
        `Refresh token payload verification failed: ${(error as Error).message}`,
      );
      throw error;
    }
  }

  private validateUserFromPayload(payload: TokenPayload) {
    this.logger.log('Validating user from refresh token payload.');
    try {
      return this.payloadValidator.validatePayload(payload);
    } catch (error) {
      this.logger.warn(
        `User validation from payload failed: ${(error as Error).message}`,
      );
      throw error;
    }
  }
}
