import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPaginatedUsersByRoleQuery } from '../get-paginated-users-by-role.query';
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { PaginatedListMapper } from '../../../../shared/pagination/mappers/paginated-list.mapper';
import { UserMapper } from '../../mappers/user.mapper';

@QueryHandler(GetPaginatedUsersByRoleQuery)
export class GetPaginatedUsersByRoleHandler
  implements IQueryHandler<GetPaginatedUsersByRoleQuery>
{
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Executes the query to get paginated users by role.
   * @param role - The role of the users to retrieve.
   * @param paginationParams - The pagination parameters.
   * @returns A paginated list of user DTOs.
   */
  async execute({ role, paginationParams }: GetPaginatedUsersByRoleQuery) {
    const paginatedDbUsers = await this.userRepository.getUsersByRole(
      role,
      paginationParams,
    );

    return PaginatedListMapper.toDto(
      paginationParams,
      paginatedDbUsers,
      (model) => UserMapper.toDto(model),
    );
  }
}
