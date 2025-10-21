import { Module } from '@nestjs/common';
import { UsersController } from './presentation/users.controller';
import { PrismaUserRepository } from './infrastructure/prisma/prisma-user.repository';
import { PrismaModule } from '../core/prisma/prisma.module';
import { CreateUserHandler } from './application/commands/handlers/create-user.handler';
import { UsersOrchestratorService } from './application/users-orchestrator.service';
import { UserRepository } from './domain/interfaces/user.repository.interface';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    CreateUserHandler,
    UsersOrchestratorService,
  ],
  exports: [],
})
export class UserModule {}
