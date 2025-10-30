import { Query } from '@nestjs/cqrs';
import { User } from '../../../domain/entities/user.entity';
import { UUID } from 'node:crypto';

export class GetUserModelByIdQuery extends Query<User | null> {
  constructor(public readonly userId: UUID) {
    super();
  }
}
