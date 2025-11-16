import { GetPaginatedUsersByRoleHandler } from '../../../application/queries/get-paginated-users-by-role/get-paginated-users-by-role.handler';
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { Test } from '@nestjs/testing';
import { PaginationParams } from '../../../../shared/pagination/domain/types/pagination-params.type';
import { DbPaginated } from '../../../../shared/pagination/domain/types/db-paginated.type';
import { UserRole } from '../../../../shared/enums/user-role.enum';
import { GetPaginatedUsersByRoleQuery } from '../../../application/queries/get-paginated-users-by-role/get-paginated-users-by-role.query';
import { createUserFixture } from '../../fixtures/user.fixture';

const paginationParams: PaginationParams<User> = {
  page: 0,
  pageSize: 10,
  sortedFields: [],
  quickFilters: null,
  filters: null,
};

describe(GetPaginatedUsersByRoleHandler.name, () => {
  let handler: GetPaginatedUsersByRoleHandler;
  const userRepository: Pick<jest.Mocked<UserRepository>, 'getUsersByRole'> = {
    getUsersByRole: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        GetPaginatedUsersByRoleHandler,
        {
          provide: UserRepository,
          useValue: userRepository,
        },
      ],
    }).compile();
    handler = module.get(GetPaginatedUsersByRoleHandler);
  });

  it('returns paginated users for a valid role and query with users', async () => {
    const role = UserRole.DOCTOR;
    const mockUsers = [createUserFixture(), createUserFixture()];
    const paginatedDbUsers: DbPaginated<User> = {
      items: mockUsers,
      totalCount: 2,
    };
    userRepository.getUsersByRole.mockResolvedValue(paginatedDbUsers);

    const result = await handler.execute({
      role,
      paginationParams,
    } as GetPaginatedUsersByRoleQuery);

    expect(result.items).toHaveLength(2);
    expect(result.totalCount).toBe(2);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(10);
    expect(userRepository.getUsersByRole).toHaveBeenCalledWith(
      role,
      paginationParams,
    );
  });

  it('returns empty paginated list when no users are found for the role', async () => {
    const role = UserRole.ADMIN;
    const paginatedDbUsers: DbPaginated<User> = {
      items: [],
      totalCount: 0,
    };
    userRepository.getUsersByRole.mockResolvedValue(paginatedDbUsers);

    const result = await handler.execute({
      role,
      paginationParams,
    } as GetPaginatedUsersByRoleQuery);

    expect(result.items).toHaveLength(0);
    expect(result.totalCount).toBe(0);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(10);
    expect(userRepository.getUsersByRole).toHaveBeenCalledWith(
      role,
      paginationParams,
    );
  });

  it('returns paginated users for a different role, page and page size', async () => {
    const role = 'NURSE' as UserRole;
    const paginationParams = { page: 2, pageSize: 5 };
    const mockUsers = [createUserFixture(), createUserFixture()];
    const paginatedDbUsers = {
      items: mockUsers,
      totalCount: 12,
    };
    userRepository.getUsersByRole.mockResolvedValue(paginatedDbUsers);

    const result = await handler.execute({
      role,
      paginationParams,
    } as GetPaginatedUsersByRoleQuery);

    expect(result.items).toHaveLength(2);
    expect(result.totalCount).toBe(12);
    expect(result.page).toBe(2);
    expect(result.pageSize).toBe(5);
    expect(result.totalPages).toBe(3);
    expect(userRepository.getUsersByRole).toHaveBeenCalledWith(
      role,
      paginationParams,
    );
  });

  it('returns paginated users when total pages exceed current page for a specific role', async () => {
    const role = UserRole.DOCTOR;
    const paginationParams = { page: 1, pageSize: 10 };
    const mockUsers = Array.from({ length: 10 }, () => createUserFixture());
    const paginatedDbUsers = {
      items: mockUsers,
      totalCount: 25,
    };
    userRepository.getUsersByRole.mockResolvedValue(paginatedDbUsers);

    const result = await handler.execute({
      role,
      paginationParams,
    } as GetPaginatedUsersByRoleQuery);

    expect(result.items).toHaveLength(10);
    expect(result.totalCount).toBe(25);
    expect(userRepository.getUsersByRole).toHaveBeenCalledWith(
      role,
      paginationParams,
    );
  });
});
