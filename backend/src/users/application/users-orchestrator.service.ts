import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commands/create-user.command';
import { UserCreateDto } from '../presentation/dtos/user-create.dto';
import { UUID } from 'crypto';

@Injectable()
export class UsersOrchestratorService {
  constructor(private readonly commandBus: CommandBus) {}

  /**
   * Create a new user by dispatching the CreateUserCommand.
   * @param userCreateDto - Data Transfer Object containing user creation details.
   * @param registeredById - Optional ID of the user who is registering the new user.
   * @returns A Promise that resolves to the created UserDto.
   */
  async createUser(userCreateDto: UserCreateDto, registeredById?: UUID) {
    return await this.commandBus.execute(
      new CreateUserCommand(userCreateDto, registeredById),
    );
  }
}
