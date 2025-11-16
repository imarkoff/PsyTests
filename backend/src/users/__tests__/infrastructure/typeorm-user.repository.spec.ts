import { TypeOrmUserRepository } from '../../infrastructure/typeorm/type-orm-user.repository';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import {
  PaginateProps,
  TypeOrmPaginator,
} from '../../../shared/pagination/application/typeorm-paginator/typeorm-paginator.abstract';
import { PaginationParams } from '../../../shared/pagination/domain/types/pagination-params.type';
import { Test } from '@nestjs/testing';
import { DbPaginated } from '../../../shared/pagination/domain/types/db-paginated.type';
import { createUserFixture } from '../fixtures/user.fixture';
import { UserRole } from '../../../shared/enums/user-role.enum';
import { randomUUID } from 'node:crypto';

const paginationParams: PaginationParams<User> = {
  page: 0,
  pageSize: 10,
  sortedFields: [],
  quickFilters: null,
  filters: null,
};

describe(TypeOrmUserRepository.name, () => {
  let repository: TypeOrmUserRepository;

  const typeOrmRepo: Pick<
    jest.Mocked<Repository<User>>,
    'findOneBy' | 'save' | 'softDelete' | 'target'
  > = {
    findOneBy: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
    target: User,
  };
  const paginator: Pick<jest.Mocked<TypeOrmPaginator>, 'paginate'> = {
    paginate: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TypeOrmUserRepository,
        {
          provide: DataSource,
          useValue: {
            getRepository: () => typeOrmRepo,
          },
        },
        {
          provide: TypeOrmPaginator,
          useValue: paginator,
        },
      ],
    }).compile();

    repository = module.get(TypeOrmUserRepository);
  });

  describe('getUsers', () => {
    it('returns paginated users from paginator', async () => {
      const expectedResult: DbPaginated<User> = {
        items: [createUserFixture(), createUserFixture()],
        totalCount: 2,
      };
      paginator.paginate.mockResolvedValueOnce(expectedResult);

      const result = await repository.getUsers(paginationParams);

      expect(result).toEqual(expectedResult);
    });

    it('calls paginator.paginate with correct params', async () => {
      await repository.getUsers(paginationParams);

      expect(paginator.paginate).toHaveBeenCalledWith(<PaginateProps<User>>{
        model: typeOrmRepo.target,
        paginationParams,
        filterFields: ['name', 'surname', 'patronymic', 'phone'],
      });
    });
  });

  describe('getUsersByRole', () => {
    it('returns paginated users from paginator', async () => {
      const expectedResult: DbPaginated<User> = {
        items: [createUserFixture(), createUserFixture()],
        totalCount: 2,
      };
      paginator.paginate.mockResolvedValueOnce(expectedResult);

      const role = UserRole.ADMIN;
      const result = await repository.getUsersByRole(role, paginationParams);

      expect(result).toEqual(expectedResult);
    });

    it('calls paginator.paginate with correct params', async () => {
      const role = UserRole.ADMIN;
      await repository.getUsersByRole(role, paginationParams);

      expect(paginator.paginate).toHaveBeenCalledWith(<PaginateProps<User>>{
        model: typeOrmRepo.target,
        paginationParams,
        filterFields: ['name', 'surname', 'patronymic', 'phone'],
        where: { role },
      });
    });
  });

  describe('getUserById', () => {
    it('returns user when user exists', async () => {
      const user = createUserFixture();
      typeOrmRepo.findOneBy.mockResolvedValueOnce(user);

      const response = await repository.getUserById(user.id);

      expect(response).toEqual(user);
    });

    it('returns null when user does not exist', async () => {
      const userId = randomUUID();
      typeOrmRepo.findOneBy.mockResolvedValueOnce(null);

      const response = await repository.getUserById(userId);

      expect(response).toBeNull();
    });

    it('calls findOneBy with correct params', async () => {
      const userId = randomUUID();
      await repository.getUserById(userId);

      expect(typeOrmRepo.findOneBy).toHaveBeenCalledWith({ id: userId });
    });
  });

  describe('getUserByPhone', () => {
    it('returns user when user exists', async () => {
      const user = createUserFixture();
      typeOrmRepo.findOneBy.mockResolvedValueOnce(user);

      const response = await repository.getUserByPhone(user.phone);

      expect(response).toEqual(user);
    });

    it('returns null when user does not exist', async () => {
      const phone = '+1234567890';
      typeOrmRepo.findOneBy.mockResolvedValueOnce(null);

      const response = await repository.getUserByPhone(phone);

      expect(response).toBeNull();
    });

    it('calls findOneBy with correct params', async () => {
      const phone = '+1234567890';
      await repository.getUserByPhone(phone);

      expect(typeOrmRepo.findOneBy).toHaveBeenCalledWith({ phone });
    });
  });

  describe('createUser', () => {
    it('returns the created user', async () => {
      const user = createUserFixture();
      const changedUser = { ...user, id: randomUUID() };
      typeOrmRepo.save.mockResolvedValueOnce(changedUser);

      const result = await repository.createUser(user);

      expect(result).toEqual(changedUser);
    });

    it('calls save with correct params', async () => {
      const user = createUserFixture();

      await repository.createUser(user);

      expect(typeOrmRepo.save).toHaveBeenCalledWith(user);
    });
  });

  describe('updateUser', () => {
    it('returns the updated user', async () => {
      const user = createUserFixture();
      const changedUser = { ...user, name: 'UpdatedName' };
      typeOrmRepo.save.mockResolvedValueOnce(changedUser);

      const result = await repository.updateUser(changedUser);

      expect(result).toEqual(changedUser);
    });

    it('calls save with correct params', async () => {
      const user = createUserFixture();
      const changedUser = { ...user, name: 'UpdatedName' };

      await repository.updateUser(changedUser);

      expect(typeOrmRepo.save).toHaveBeenCalledWith(changedUser);
    });
  });

  describe('deleteUser', () => {
    it('calls softDelete with correct params', async () => {
      const userId = randomUUID();

      await repository.deleteUser(userId);

      expect(typeOrmRepo.softDelete).toHaveBeenCalledWith({ id: userId });
    });

    it('returns void on successful deletion', async () => {
      const userId = randomUUID();

      const result = await repository.deleteUser(userId);

      expect(result).toBeUndefined();
    });
  });
});
