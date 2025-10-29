import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Observable, lastValueFrom } from 'rxjs';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  private readonly logger = new Logger(LocalAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
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

      if (resolved) {
        this.logger.debug('Local authentication successful.');
      } else {
        this.logger.warn('Local authentication failed.');
      }
      return resolved;
    } catch (error) {
      this.logger.warn(
        `Local authentication failed: ${(error as Error).message}`,
      );
      throw error;
    }
  }
}
