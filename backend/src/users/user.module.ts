import { Module } from '@nestjs/common';
import { UsersController } from './presentation/users.controller';
import { PrismaUserRepository } from './infrastructure/prisma/prisma-user.repository';
import { PrismaModule } from '../core/prisma/prisma.module';
import { AuthModule } from '../core/auth/auth.module';
import { CreateUserHandler } from './application/commands/create-user/create-user.handler';
import { UsersOrchestratorService } from './application/users-orchestrator.service';
import { UserRepository } from './domain/interfaces/user.repository.interface';
import { CqrsModule } from '@nestjs/cqrs';
import { UpdateUserHandler } from './application/commands/update-user/update-user.handler';
import { ChangePasswordByAdminHandler } from './application/commands/change-password-by-admin/change-password-by-admin.handler';
import { UpdateLastLoginHandler } from './application/commands/update-last-login/update-last-login.handler';
import { DeleteUserHandler } from './application/commands/delete-user/delete-user.handler';
import { GetPaginatedUsersHandler } from './application/queries/get-paginated-users/get-paginated-users.handler';
import { GetPaginatedUsersByRoleHandler } from './application/queries/get-paginated-users-by-role/get-paginated-users-by-role.handler';
import { GetUserByPhoneHandler } from './application/queries/get-user-by-phone/get-user-by-phone.handler';
import { GetUserByIdHandler } from './application/queries/get-user-by-id/get-user-by-id.handler';

@Module({
  imports: [PrismaModule, AuthModule, CqrsModule],
  controllers: [UsersController],
  providers: [
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    CreateUserHandler,
    UpdateUserHandler,
    ChangePasswordByAdminHandler,
    UpdateLastLoginHandler,
    DeleteUserHandler,
    GetPaginatedUsersHandler,
    GetPaginatedUsersByRoleHandler,
    GetUserByIdHandler,
    GetUserByPhoneHandler,
    UsersOrchestratorService,
  ],
  exports: [],
})
export class UserModule {}
