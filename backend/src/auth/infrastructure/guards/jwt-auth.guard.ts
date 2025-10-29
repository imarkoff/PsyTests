import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../../../core/decorators/public.decorator';
import { Observable, lastValueFrom } from 'rxjs';

/**
 * JWT Authentication Guard that extends the Passport AuthGuard.
 * It checks for public routes using the Reflector.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      this.logger.debug('Public route accessed, skipping authentication.');
      return true;
    }

    this.logger.debug('Authentication attempted to authenticate.');

    try {
      const result = super.canActivate(context);
      let resolved: boolean;

      if (result instanceof Observable) {
        resolved = await lastValueFrom(result);
      } else if (result instanceof Promise) {
        resolved = await result;
      } else {
        resolved = result;
      }

      if (resolved) this.logger.debug('Authentication successful.');
      else this.logger.warn('Authentication failed.');
      return resolved;
    } catch (error) {
      this.logger.warn(`Authentication failed: ${(error as Error).message}`);
      throw error;
    }
  }
}
