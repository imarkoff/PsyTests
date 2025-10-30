/* eslint-disable @typescript-eslint/unbound-method */
import { GetPaginatedUsersByRoleHandler } from '../../../application/queries/get-paginated-users-by-role/get-paginated-users-by-role.handler';
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { Test } from '@nestjs/testing';
import { PaginationParams } from '../../../../shared/pagination/types/pagination-params.type';
import { createUserPersistence } from '../../../../__tests__/fixtures/user.fixture';
import { DbPaginated } from '../../../../shared/pagination/types/db-paginated.type';
import { UserRole } from '../../../../shared/enums/user-role.enum';
import { GetPaginatedUsersByRoleQuery } from '../../../application/queries/get-paginated-users-by-role/get-paginated-users-by-role.query';

describe(GetPaginatedUsersByRoleHandler.name, () => {
  let handler: GetPaginatedUsersByRoleHandler;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetPaginatedUsersByRoleHandler,
        {
          provide: UserRepository,
          useValue: {
            getUsersByRole: jest.fn(),
          },
        },
      ],
    }).compile();
    handler = module.get(GetPaginatedUsersByRoleHandler);
    userRepository = module.get(UserRepository);
  });

  it('returns paginated users for a valid role and query with users', async () => {
    const role = UserRole.DOCTOR;
    const paginationParams: PaginationParams<User> = {
      page: 1,
      pageSize: 10,
      sortedFields: [],
    };
    const mockUsers = [
      User.fromPersistence(createUserPersistence()),
      User.fromPersistence(createUserPersistence()),
    ] as User[];
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
    const paginationParams: PaginationParams<User> = {
      page: 1,
      pageSize: 10,
      sortedFields: [],
    };
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
    const mockUsers = [
      User.fromPersistence(createUserPersistence()),
      User.fromPersistence(createUserPersistence()),
    ] as User[];
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
    const mockUsers = Array.from({ length: 10 }, () =>
      User.fromPersistence(createUserPersistence()),
    );
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
