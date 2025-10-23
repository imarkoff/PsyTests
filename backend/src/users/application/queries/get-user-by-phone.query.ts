import { Query } from '@nestjs/cqrs';
import { UserDto } from '../../presentation/dtos/user.dto';

export class GetUserByPhoneQuery extends Query<UserDto | null> {
  constructor(public readonly phoneNumber: string) {
    super();
  }
}
