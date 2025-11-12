import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPaginatedUsersByRoleQuery } from './get-paginated-users-by-role.query';
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { PaginatedListMapper } from '../../../../shared/pagination/mappers/paginated-list.mapper';
import { UserMapper } from '../../mappers/user.mapper';
import { Logger } from '@nestjs/common';

@QueryHandler(GetPaginatedUsersByRoleQuery)
export class GetPaginatedUsersByRoleHandler
  implements IQueryHandler<GetPaginatedUsersByRoleQuery>
{
  private readonly logger = new Logger(GetPaginatedUsersByRoleHandler.name);

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

    this.logger.debug(
      `Fetched ${paginatedDbUsers.items.length} users with role ${role} ` +
        `with page size ${paginationParams.pageSize} on page ${paginationParams.page}.`,
    );

    return PaginatedListMapper.toDto(
      paginationParams,
      paginatedDbUsers,
      (model) => UserMapper.toDto(model),
    );
  }
}
