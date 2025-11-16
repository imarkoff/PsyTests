/* eslint-disable @typescript-eslint/unbound-method */
import { PrismaUserRepository } from '../../../infrastructure/prisma/prisma-user.repository';
import { PrismaService } from '../../../../core/prisma/prisma.service';
import { PrismaPaginator } from '../../../../shared/pagination/application/prisma-applier/prisma-paginator.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PaginationParams } from '../../../../shared/pagination/domain/types/pagination-params.type';
import { User } from '../../../domain/entities/user.entity';
import { createUserPersistence } from '../../../../__tests__/fixtures/user.fixture';
import { UserRole } from '../../../../shared/enums/user-role.enum';
import { Prisma } from 'generated/prisma';
import { randomUUID } from 'node:crypto';

const paginationParams: PaginationParams<User> = {
  page: 1,
  pageSize: 10,
  sortedFields: [],
  quickFilters: null,
  filters: null,
};

describe(PrismaUserRepository.name, () => {
  let repository: PrismaUserRepository;
  let prismaUserDelegate: jest.Mocked<Prisma.UserDelegate>;
  let prismaService: jest.Mocked<PrismaService>;
  let prismaPaginator: jest.Mocked<PrismaPaginator>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaUserRepository,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: jest.fn(),
              count: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: PrismaPaginator,
          useValue: {
            applyPagination: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get(PrismaUserRepository);
    prismaService = module.get(PrismaService);
    prismaUserDelegate = prismaService.user as jest.Mocked<Prisma.UserDelegate>;
    prismaPaginator = module.get(PrismaPaginator);
  });

  describe(PrismaUserRepository.prototype.getUsers.name, () => {
    it('returns paginated users when users exist', async () => {
      const mockPaginated = {
        items: [User.fromPersistence(createUserPersistence())],
        totalCount: 1,
      };
      prismaPaginator.applyPagination.mockResolvedValue(mockPaginated);

      const result = await repository.getUsers(paginationParams);

      expect(result).toEqual(mockPaginated);
      expect(prismaPaginator.applyPagination).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
        paginationParams,
        ['surname', 'name', 'patronymic', 'phone'],
        { deletedAt: null },
      );
    });

    it('returns empty paginated list when no users exist', async () => {
      const mockPaginated = {
        items: [],
        totalCount: 0,
      };
      prismaPaginator.applyPagination.mockResolvedValue(mockPaginated);

      const result = await repository.getUsers(paginationParams);

      expect(result).toEqual(mockPaginated);
    });
  });

  describe(PrismaUserRepository.prototype.getUsersByRole.name, () => {
    it('returns paginated users for a specific role when users exist', async () => {
      const role = UserRole.ADMIN;
      const mockPaginated = {
        items: [User.fromPersistence(createUserPersistence())],
        totalCount: 1,
      };
      prismaPaginator.applyPagination.mockResolvedValue(mockPaginated);

      const result = await repository.getUsersByRole(role, paginationParams);

      expect(result).toEqual(mockPaginated);
      expect(prismaPaginator.applyPagination).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
        paginationParams,
        ['surname', 'name', 'patronymic', 'phone'],
        { role, deletedAt: null },
      );
    });

    it('returns empty paginated list when no users exist for the role', async () => {
      const role = 'NURSE' as UserRole;
      const mockPaginated = {
        items: [],
        totalCount: 0,
      };
      prismaPaginator.applyPagination.mockResolvedValue(mockPaginated);

      const result = await repository.getUsersByRole(role, paginationParams);

      expect(result).toEqual(mockPaginated);
    });
  });

  describe(PrismaUserRepository.prototype.getUserById.name, () => {
    it('returns user when user exists', async () => {
      const mockPrismaUser = createUserPersistence();
      prismaUserDelegate.findUnique.mockResolvedValue(mockPrismaUser);
      const mockUser = User.fromPersistence(mockPrismaUser);

      const result = await repository.getUserById(mockUser.id);

      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockPrismaUser.id, deletedAt: null },
      });
    });

    it('returns null when user does not exist', async () => {
      const id = randomUUID();
      (
        prismaService.user as jest.Mocked<Prisma.UserDelegate>
      ).findUnique.mockResolvedValue(null);

      const result = await repository.getUserById(id);

      expect(result).toBeNull();
    });
  });

  describe(PrismaUserRepository.prototype.getUserByPhone.name, () => {
    it('returns user when user exists', async () => {
      const mockPrismaUser = createUserPersistence();
      prismaUserDelegate.findUnique.mockResolvedValue(mockPrismaUser);
      const mockUser = User.fromPersistence(mockPrismaUser);

      const result = await repository.getUserByPhone(mockPrismaUser.phone);

      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { phone: mockPrismaUser.phone, deletedAt: null },
      });
    });

    it('returns null when user does not exist', async () => {
      const phone = '+1234567890';
      prismaUserDelegate.findUnique.mockResolvedValue(null);

      const result = await repository.getUserByPhone(phone);

      expect(result).toBeNull();
    });
  });

  describe(PrismaUserRepository.prototype.createUser.name, () => {
    it('creates and returns new user', async () => {
      const mockPrismaUser = createUserPersistence();
      const userData = User.fromPersistence(mockPrismaUser);
      const convertedUser = userData.toPersistence();
      prismaUserDelegate.create.mockResolvedValue(mockPrismaUser);

      const result = await repository.createUser(userData);

      expect(result).toEqual(userData);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: convertedUser,
      });
    });
  });

  describe(PrismaUserRepository.prototype.updateUser.name, () => {
    it('updates and returns existing user', async () => {
      const mockPrismaUser = createUserPersistence();
      const updatedUser = User.fromPersistence(mockPrismaUser);
      const convertedUser = updatedUser.toPersistence();
      prismaUserDelegate.update.mockResolvedValue(mockPrismaUser);

      const result = await repository.updateUser(updatedUser);

      expect(result).toEqual(updatedUser);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: updatedUser.id },
        data: convertedUser,
      });
    });
  });

  describe(PrismaUserRepository.prototype.deleteUser.name, () => {
    it('soft deletes user by id', async () => {
      const id = randomUUID();
      prismaUserDelegate.update.mockResolvedValue(createUserPersistence());

      await repository.deleteUser(id);

      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: { deletedAt: expect.any(Date) },
      });
      expect(prismaService.user.delete).not.toHaveBeenCalled();
    });
  });
});
