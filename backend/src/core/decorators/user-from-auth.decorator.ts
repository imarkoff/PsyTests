import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../users/domain/entities/user.entity';

/**
 * Custom decorator to extract the authenticated user from the request object.
 * Usage: @UserFromAuth() user: User
 */
export const UserFromAuth = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request: { user: User } = ctx.switchToHttp().getRequest();
    return request.user ?? null;
  },
);
