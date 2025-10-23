import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { UsersOrchestratorService } from '../application/users-orchestrator.service';
import { UserCreateDto } from './dtos/user-create.dto';
import { UserUpdateDto } from './dtos/user-update.dto';
import { type UUID } from 'node:crypto';
import { UserByPhoneDto } from './dtos/user-by-phone.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersOrchestrator: UsersOrchestratorService) {}

  @Get()
  async getUsers() {
    return this.usersOrchestrator.getPaginatedUsers({
      page: 1,
      pageSize: 10,
      sortedFields: [],
    });
  }

  @Get(':userId')
  async getUserById(@Param('userId', new ParseUUIDPipe()) userId: UUID) {
    return this.usersOrchestrator.getUserById(userId);
  }

  @Get('/phone/:phoneNumber')
  async getUserByPhoneNumber(@Param() params: UserByPhoneDto) {
    return this.usersOrchestrator.getUserByPhoneNumber(params.phoneNumber);
  }

  @Post()
  async createUser(@Body() userCreateDto: UserCreateDto) {
    return this.usersOrchestrator.createUser(userCreateDto);
  }

  @Put(':userId')
  async updateUser(
    @Param('userId', new ParseUUIDPipe()) userId: UUID,
    @Body() userUpdateDto: UserUpdateDto,
  ) {
    return this.usersOrchestrator.updateUser(userId, userUpdateDto);
  }
}
