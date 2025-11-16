import { GetPaginatedUsersHandler } from '../../../application/queries/get-paginated-users/get-paginated-users.handler';
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { Test } from '@nestjs/testing';
import { User } from '../../../domain/entities/user.entity';
import { PaginationParams } from '../../../../shared/pagination/domain/types/pagination-params.type';
import { DbPaginated } from '../../../../shared/pagination/domain/types/db-paginated.type';
import { GetPaginatedUsersQuery } from '../../../application/queries/get-paginated-users/get-paginated-users.query';
import { createUserFixture } from '../../fixtures/user.fixture';

const paginationParams: PaginationParams<User> = {
  page: 1,
  pageSize: 10,
  sortedFields: [],
  filters: null,
  quickFilters: null,
};

describe(GetPaginatedUsersHandler.name, () => {
  let handler: GetPaginatedUsersHandler;

  const userRepository: Pick<jest.Mocked<UserRepository>, 'getUsers'> = {
    getUsers: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        GetPaginatedUsersHandler,
        {
          provide: UserRepository,
          useValue: userRepository,
        },
      ],
    }).compile();
    handler = module.get(GetPaginatedUsersHandler);
  });

  it('returns paginated users for a valid query with users', async () => {
    const mockUsers = [createUserFixture(), createUserFixture()];
    const paginatedDbUsers: DbPaginated<User> = {
      items: mockUsers,
      totalCount: 2,
    };
    userRepository.getUsers.mockResolvedValue(paginatedDbUsers);

    const result = await handler.execute({
      paginationParams,
    } as GetPaginatedUsersQuery);

    expect(result.items).toHaveLength(2);
    expect(result.totalCount).toBe(2);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(10);
    expect(userRepository.getUsers).toHaveBeenCalledWith(paginationParams);
  });

  it('returns empty paginated list when no users are found', async () => {
    const paginatedDbUsers: DbPaginated<User> = {
      items: [],
      totalCount: 0,
    };
    userRepository.getUsers.mockResolvedValue(paginatedDbUsers);

    const result = await handler.execute({
      paginationParams,
    } as GetPaginatedUsersQuery);

    expect(result.items).toHaveLength(0);
    expect(result.totalCount).toBe(0);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(10);
    expect(userRepository.getUsers).toHaveBeenCalledWith(paginationParams);
  });

  it('returns paginated users for a different page and page size', async () => {
    const paginationParams = { page: 2, pageSize: 5 };
    const mockUsers = [createUserFixture(), createUserFixture()];
    const paginatedDbUsers = {
      items: mockUsers,
      totalCount: 12,
    };
    userRepository.getUsers.mockResolvedValue(paginatedDbUsers);

    const result = await handler.execute({
      paginationParams,
    } as GetPaginatedUsersQuery);

    expect(result.items).toHaveLength(2);
    expect(result.totalCount).toBe(12);
    expect(result.page).toBe(2);
    expect(result.pageSize).toBe(5);
    expect(result.totalPages).toBe(3);
    expect(userRepository.getUsers).toHaveBeenCalledWith(paginationParams);
  });

  it('returns paginated users when total pages exceed current page', async () => {
    const paginationParams = { page: 1, pageSize: 10 };
    const mockUsers = Array.from({ length: 10 }, () => createUserFixture());
    const paginatedDbUsers = {
      items: mockUsers,
      totalCount: 25,
    };
    userRepository.getUsers.mockResolvedValue(paginatedDbUsers);

    const result = await handler.execute({
      paginationParams,
    } as GetPaginatedUsersQuery);

    expect(result.items).toHaveLength(10);
    expect(result.totalCount).toBe(25);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(10);
    expect(result.totalPages).toBe(3);
    expect(userRepository.getUsers).toHaveBeenCalledWith(paginationParams);
  });
});
