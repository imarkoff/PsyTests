import { User } from '../../domain/entities/user.entity';
import { UserRole } from '../../../shared/enums/user-role.enum';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { PrismaPaginator } from '../../../shared/pagination/prisma-applier/prisma-paginator.service';
import { PaginationParams } from '../../../shared/pagination/types/pagination-params.type';
import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { PaginatedList } from '../../../shared/pagination/types/paginated-list.type';
import { UserRepository } from '../../domain/interfaces/user.repository.interface';
import { User as PrismaUser } from 'generated/prisma';
import { DbPaginated } from '../../../shared/pagination/types/db-paginated.type';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly prismaPaginationApplier: PrismaPaginator,
  ) {}

  async getUsers(params: PaginationParams<User>): Promise<DbPaginated<User>> {
    const prismaPaginatedList =
      await this.prismaPaginationApplier.applyPagination<'User', PrismaUser>(
        (args) => this.prisma.user.findMany(args),
        (args) => this.prisma.user.count(args),
        params as PaginationParams<PrismaUser>,
        ['surname', 'name', 'patronymic', 'phone'],
        { deletedAt: null },
      );

    return prismaPaginatedList as DbPaginated<User>;
  }

  async getUsersByRole(
    role: UserRole,
    params: PaginationParams<User>,
  ): Promise<DbPaginated<User>> {
    const prismaPaginatedList =
      await this.prismaPaginationApplier.applyPagination<'User', PrismaUser>(
        (args) => this.prisma.user.findMany(args),
        (args) => this.prisma.user.count(args),
        params as PaginationParams<PrismaUser>,
        ['surname', 'name', 'patronymic', 'phone'],
        { role, deletedAt: null },
      );

    return prismaPaginatedList as PaginatedList<User>;
  }

  async getUserById(id: UUID): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });
    return this.mapToDomainUser(user);
  }

  async getUserByPhone(phone: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { phone, deletedAt: null },
    });
    return this.mapToDomainUser(user);
  }

  async createUser(data: User): Promise<User> {
    const user = await this.prisma.user.create({ data });
    return this.mapToDomainUser(user)!;
  }

  async updateUser(updatedUser: User): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id: updatedUser.id },
      data: updatedUser,
    });
    return this.mapToDomainUser(user)!;
  }

  async deleteUser(id: UUID) {
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  private mapToDomainUser(prismaUser: PrismaUser | null): User | null {
    if (!prismaUser) return null;
    return User.fromPersistence(prismaUser);
  }
}
