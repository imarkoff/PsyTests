import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
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
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());

    if (!roles || roles.length === 0) return true;

    const request = context
      .switchToHttp()
      .getRequest<Request & { user: User }>();
    const user = request.user;

    return roles.includes(user.role);
  }
}
