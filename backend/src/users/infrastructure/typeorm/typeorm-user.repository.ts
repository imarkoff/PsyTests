import { UserRepository } from '../../domain/interfaces/user.repository.interface';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { DbPaginated } from '../../../shared/pagination/domain/types/db-paginated.type';
import { PaginationParams } from '../../../shared/pagination/domain/types/pagination-params.type';
import { UserRole } from '../../../shared/enums/user-role.enum';
import { UUID } from 'node:crypto';
import { TypeOrmPaginator } from '../../../shared/pagination/application/typeorm-paginator/typeorm-paginator.abstract';

@Injectable()
export class TypeormUserRepository implements UserRepository {
  private repo: Repository<User>;

  constructor(
    private readonly dataSource: DataSource,
    private readonly paginator: TypeOrmPaginator,
  ) {
    this.repo = this.dataSource.getRepository(User);
  }

  getUsers(params: PaginationParams<User>): Promise<DbPaginated<User>> {
    return this.paginator.paginate({
      model: this.repo.target,
      paginationParams: params,
      filterFields: ['name', 'surname', 'patronymic', 'phone'],
    });
  }

  getUsersByRole(
    role: UserRole,
    params: PaginationParams<User>,
  ): Promise<DbPaginated<User>> {
    return this.paginator.paginate({
      model: this.repo.target,
      paginationParams: params,
      filterFields: ['name', 'surname', 'patronymic', 'phone'],
      where: { role },
    });
  }

  getUserById(id: UUID): Promise<User | null> {
    return this.repo.findOneBy({ id });
  }

  getUserByPhone(phone: string): Promise<User | null> {
    return this.repo.findOneBy({ phone });
  }

  createUser(data: User): Promise<User> {
    return this.repo.save(data);
  }

  updateUser(updatedUser: User): Promise<User> {
    return this.repo.save(updatedUser);
  }

  async deleteUser(id: UUID): Promise<void> {
    await this.repo.softDelete({ id });
  }
}
