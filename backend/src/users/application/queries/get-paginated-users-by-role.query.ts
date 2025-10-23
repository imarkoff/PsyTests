import { Query } from '@nestjs/cqrs';
import { PaginatedList } from '../../../shared/pagination/types/paginated-list.type';
import { UserDto } from '../../presentation/dtos/user.dto';
import { User } from '../../domain/entities/user.entity';
import { UserRole } from '../../../shared/enums/user-role.enum';
import { PaginationParams } from '../../../shared/pagination/types/pagination-params.type';

export class GetPaginatedUsersByRoleQuery extends Query<
  PaginatedList<UserDto, User>
> {
  /**
   * @param role - The role of the users to retrieve.
   * @param paginationParams - The pagination parameters (page number, page size, etc.).
   */
  constructor(
    public readonly role: UserRole,
    public readonly paginationParams: PaginationParams<User>,
  ) {
    super();
  }
}
