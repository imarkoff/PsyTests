import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { type UUID } from 'node:crypto';
import { UserFromAuth } from '../../core/decorators/user-from-auth.decorator';
import { User } from '../domain/entities/user.entity';
import { UserMapper } from '../application/mappers/user.mapper';
import { UsersOrchestrator } from '../application/services/users-orchestrator/users-orchestrator.abstract';
import { ApiBearerAuth } from '@nestjs/swagger';
import type { UserDto } from './dtos/user.dto';

/**
 * Users Controller
 * @remarks Handles user-related HTTP requests
 */
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersOrchestrator: UsersOrchestrator) {}

  /**
   * Get current authenticated user
   *
   * @remarks Extracts the user from the authentication token
   *
   * @param user - The authenticated user extracted from the request
   * @returns The user data transfer object
   * @throws {401} If the user is not authenticated when accessing protected routes
   */
  @Get('me')
  getCurrentUser(@UserFromAuth() user: User): UserDto {
    return UserMapper.toDto(user);
  }

  /**
   * Get user by ID
   *
   * @remarks Retrieves a user entity based on the provided UUID
   *
   * @param userId - The UUID of the user to retrieve
   * @returns The user entity
   * @throws {400} If the provided userId is not a valid UUID
   * @throws {401} If the requester is not authenticated when accessing protected routes
   * @throws {404} If no user is found with the given ID
   */
  @Get(':userId')
  async getUserById(@Param('userId', new ParseUUIDPipe()) userId: UUID) {
    return this.usersOrchestrator.getUserById(userId);
  }
}
