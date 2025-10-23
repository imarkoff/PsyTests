import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPaginatedUsersQuery } from './get-paginated-users.query';
import { PaginatedList } from 'src/shared/pagination/types/paginated-list.type';
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { UserMapper } from '../../mappers/user.mapper';
import { PaginatedListMapper } from '../../../../shared/pagination/mappers/paginated-list.mapper';
import { User } from '../../../domain/entities/user.entity';
import { UserDto } from '../../../presentation/dtos/user.dto';

@QueryHandler(GetPaginatedUsersQuery)
export class GetPaginatedUsersHandler
  implements IQueryHandler<GetPaginatedUsersQuery>
{
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Gets paginated users based on the provided pagination parameters.
   * @param paginationParams - The pagination parameters (page number, page size, etc.)
   * @returns A paginated list of UserDto objects.
   */
  async execute({
    paginationParams,
  }: GetPaginatedUsersQuery): Promise<PaginatedList<UserDto, User>> {
    const paginatedDbUsers =
      await this.userRepository.getUsers(paginationParams);

    return PaginatedListMapper.toDto(
      paginationParams,
      paginatedDbUsers,
      (model) => UserMapper.toDto(model),
    );
  }
}
