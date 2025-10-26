import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../users/domain/entities/user.entity';

export const UserFromAuth = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request: { user: User } = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
