import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { type UUID } from 'node:crypto';
import { UserFromAuth } from '../../core/decorators/user-from-auth.decorator';
import { User } from '../domain/entities/user.entity';
import { UserMapper } from '../application/mappers/user.mapper';
import { UsersOrchestrator } from '../application/services/users-orchestrator/users-orchestrator.abstract';

@Controller('users')
export class UsersController {
  constructor(private readonly usersOrchestrator: UsersOrchestrator) {}

  @Get('me')
  getCurrentUser(@UserFromAuth() user: User) {
    return UserMapper.toDto(user);
  }

  @Get(':userId')
  async getUserById(@Param('userId', new ParseUUIDPipe()) userId: UUID) {
    return this.usersOrchestrator.getUserById(userId);
  }
}
