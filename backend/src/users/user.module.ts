import { Module } from '@nestjs/common';
import { UsersController } from './presentation/users.controller';
import { PrismaUserRepository } from './infrastructure/prisma/prisma-user.repository';
import { PrismaModule } from '../core/prisma/prisma.module';
import { AuthModule } from '../core/auth/auth.module';
import { CreateUserHandler } from './application/commands/handlers/create-user.handler';
import { UsersOrchestratorService } from './application/users-orchestrator.service';
import { UserRepository } from './domain/interfaces/user.repository.interface';
import { CqrsModule } from '@nestjs/cqrs';
import { UpdateUserHandler } from './application/commands/handlers/update-user.handler';

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
    UsersOrchestratorService,
  ],
  exports: [],
})
export class UserModule {}
