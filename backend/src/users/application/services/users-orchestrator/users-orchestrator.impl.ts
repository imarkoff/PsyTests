import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { UUID } from 'node:crypto';
import { GetUserByIdQuery } from '../../queries/get-user-by-id/get-user-by-id.query';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found.exception';

@Injectable()
export class UsersOrchestratorImpl {
  constructor(private readonly queryBus: QueryBus) {}

  async getUserById(userId: UUID) {
    const user = await this.queryBus.execute(new GetUserByIdQuery(userId));
    if (!user) throw new UserNotFoundException(userId);
    return user;
  }
}
