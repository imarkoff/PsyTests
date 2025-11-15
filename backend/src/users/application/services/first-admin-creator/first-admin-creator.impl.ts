import { UserCreateDto } from 'src/users/presentation/dtos/user-create.dto';
import { FirstAdminCreator } from './first-admin-creator.abstract';
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetPaginatedUsersByRoleQuery } from '../../queries/get-paginated-users-by-role/get-paginated-users-by-role.query';
import { UserRole } from '../../../../shared/enums/user-role.enum';
import { CreateUserCommand } from '../../commands/create-user/create-user.command';
import { UserDto } from '../../../presentation/dtos/user.dto';

@Injectable()
export class FirstAdminCreatorImpl implements FirstAdminCreator {
  private readonly logger = new Logger(FirstAdminCreatorImpl.name);

  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  async createFirstAdminIfNotExists(
    userCreateDto: UserCreateDto,
  ): Promise<UserDto> {
    this.logger.debug('Checking for existing admin users.');

    const adminExists = await this.queryBus.execute(
      new GetPaginatedUsersByRoleQuery(UserRole.ADMIN, {
        page: 1,
        pageSize: 1,
        sortedFields: [],
        quickFilters: null,
        filters: null,
      }),
    );

    if (adminExists.totalCount > 0) {
      this.logger.debug(
        `No space for the second admin. Already created admin ID: ${adminExists.items[0].id}`,
      );
      throw new ForbiddenException('Admin user already exists.');
    }

    this.logger.debug('No admin users found. Creating the first admin user.');

    const userCreateDtoWithAdminRole: UserCreateDto = {
      ...userCreateDto,
      role: UserRole.ADMIN,
    };

    const user = await this.commandBus.execute(
      new CreateUserCommand(userCreateDtoWithAdminRole),
    );

    this.logger.log(
      `First admin user created with ID: ${user.id}. Keep it safe!`,
    );

    return user;
  }
}
