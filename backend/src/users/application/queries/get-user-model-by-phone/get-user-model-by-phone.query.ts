import { Query } from '@nestjs/cqrs';
import { User } from '../../../domain/entities/user.entity';

export class GetUserModelByPhoneQuery extends Query<User | null> {
  constructor(public readonly phoneNumber: string) {
    super();
  }
}
