import { Module } from '@nestjs/common';
import { UsersController } from './presentation/users.controller';
import { CoreAuthModule } from '../core/auth/core-auth.module';
import { CreateUserHandler } from './application/commands/create-user/create-user.handler';
import { UsersOrchestratorImpl } from './application/services/users-orchestrator/users-orchestrator.impl';
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
import { GetUserModelByPhoneHandler } from './application/queries/get-user-model-by-phone/get-user-model-by-phone.handler';
import { GetUserModelByIdHandler } from './application/queries/get-user-model-by-id/get-user-model-by-id.handler';
import { UsersOrchestrator } from './application/services/users-orchestrator/users-orchestrator.abstract';
import { TypeormUserRepository } from './infrastructure/typeorm/typeorm-user.repository';
import { TypeORMModule } from '../core/typeorm/typeorm.module';
import { FirstAdminCreator } from './application/services/first-admin-creator/first-admin-creator.abstract';
import { FirstAdminCreatorImpl } from './application/services/first-admin-creator/first-admin-creator.impl';

@Module({
  imports: [TypeORMModule, CoreAuthModule, CqrsModule],
  controllers: [UsersController],
  providers: [
    {
      provide: UserRepository,
      useClass: TypeormUserRepository,
    },
    {
      provide: UsersOrchestrator,
      useClass: UsersOrchestratorImpl,
    },
    {
      provide: FirstAdminCreator,
      useClass: FirstAdminCreatorImpl,
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
    GetUserModelByIdHandler,
    GetUserModelByPhoneHandler,
  ],
  exports: [],
})
export class UserModule {}
