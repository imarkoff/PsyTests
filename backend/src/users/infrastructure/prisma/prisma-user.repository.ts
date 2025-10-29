import { User } from '../../domain/entities/user.entity';
import { UserRole } from '../../../shared/enums/user-role.enum';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { PrismaPaginator } from '../../../shared/pagination/prisma-applier/prisma-paginator.service';
import { PaginationParams } from '../../../shared/pagination/types/pagination-params.type';
import { Injectable, Logger } from '@nestjs/common';
import { UUID } from 'crypto';
import { UserRepository } from '../../domain/interfaces/user.repository.interface';
import { User as PrismaUser } from 'generated/prisma';
import { DbPaginated } from '../../../shared/pagination/types/db-paginated.type';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  private readonly logger = new Logger(PrismaUserRepository.name);

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

    this.logger.debug(
      `Fetched ${prismaPaginatedList.items.length} users from the database.`,
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

    this.logger.debug(
      `Fetched ${prismaPaginatedList.items.length} users with role ${role} from the database.`,
    );

    return prismaPaginatedList as DbPaginated<User>;
  }

  async getUserById(id: UUID): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });

    if (user) {
      this.logger.debug(`User with ID ${id} found in the database.`);
      return User.fromPersistence(user);
    } else {
      this.logger.debug(`User with ID ${id} not found in the database.`);
      return null;
    }
  }

  async getUserByPhone(phone: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { phone, deletedAt: null },
    });

    if (user) {
      this.logger.debug(`User with phone ${phone} found in the database.`);
      return User.fromPersistence(user);
    } else {
      this.logger.debug(`User with phone ${phone} not found in the database.`);
      return null;
    }
  }

  async createUser(data: User): Promise<User> {
    const convertedUser = data.toPersistence();
    const createdUser = await this.prisma.user.create({ data: convertedUser });

    this.logger.debug(
      `Created new user with ID ${createdUser.id} in the database.`,
    );

    return User.fromPersistence(createdUser);
  }

  async updateUser(updatedUser: User): Promise<User> {
    const convertedUser = updatedUser.toPersistence();
    const user = await this.prisma.user.update({
      where: { id: updatedUser.id },
      data: convertedUser,
    });

    this.logger.debug(`Updated user with ID ${user.id} in the database.`);

    return User.fromPersistence(user);
  }

  async deleteUser(id: UUID) {
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    this.logger.debug(`Soft deleted user with ID ${id} in the database.`);
  }
}
