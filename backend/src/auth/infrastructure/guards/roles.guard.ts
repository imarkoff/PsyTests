import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../../../core/decorators/roles.decorator';
import { User } from '../../../users/domain/entities/user.entity';

/**
 * Guard that checks if the user has the required roles to access a route.
 * Uses the Roles decorator to get the required roles.
 * If no roles are specified, access is granted.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());

    if (!roles || roles.length === 0) {
      this.logger.debug('No roles required for this route. Access granted.');
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<Request & { user: User }>();
    const user = request.user;

    const hasRole = roles.includes(user.role);

    if (hasRole) {
      this.logger.debug(`User with role ${user.role} has access to the route.`);
    } else {
      this.logger.warn(
        `User with role ${user.role} does not have access to the route.`,
      );
    }

    return hasRole;
  }
}
