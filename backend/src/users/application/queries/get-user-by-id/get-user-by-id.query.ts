import { Query } from '@nestjs/cqrs';
import { UserDto } from '../../../presentation/dtos/user.dto';
import { UUID } from 'node:crypto';

export class GetUserByIdQuery extends Query<UserDto | null> {
  /**
   * @param userId - The unique identifier of the user to be retrieved.
   */
  constructor(public readonly userId: UUID) {
    super();
  }
}
