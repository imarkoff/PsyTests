import { Query } from '@nestjs/cqrs';
import { PaginatedList } from '../../../../shared/pagination/domain/types/paginated-list.type';
import { UserDto } from '../../../presentation/dtos/user.dto';
import { PaginationParams } from '../../../../shared/pagination/domain/types/pagination-params.type';
import { User } from '../../../domain/entities/user.entity';

export class GetPaginatedUsersQuery extends Query<
  PaginatedList<UserDto, User>
> {
  /**
   * Gets paginated users based on the provided pagination parameters.
   * @param paginationParams - The pagination parameters (page number, page size, etc.)
   */
  constructor(public readonly paginationParams: PaginationParams<User>) {
    super();
  }
}
