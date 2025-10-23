import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commands/create-user/create-user.command';
import { UserCreateDto } from '../presentation/dtos/user-create.dto';
import { UUID } from 'crypto';
import { UserUpdateDto } from '../presentation/dtos/user-update.dto';
import { UpdateUserCommand } from './commands/update-user/update-user.command';
import { PaginationParams } from '../../shared/pagination/types/pagination-params.type';
import { User } from '../domain/entities/user.entity';
import { GetPaginatedUsersQuery } from './queries/get-paginated-users/get-paginated-users.query';
import { GetUserByIdQuery } from './queries/get-user-by-id/get-user-by-id.query';
import { UserNotFoundException } from '../domain/exceptions/user-not-found.exception';
import { GetUserByPhoneQuery } from './queries/get-user-by-phone/get-user-by-phone.query';
import { UserByPhoneNotFoundException } from '../domain/exceptions/user-by-phone-not-found.exception';

@Injectable()
export class UsersOrchestratorService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  /**
   * Create a new user by dispatching the CreateUserCommand.
   * @param userCreateDto - Data Transfer Object containing user creation details.
   * @param registeredById - Optional ID of the user who is registering the new user.
   * @returns A Promise that resolves to the created UserDto.
   * @throws PhoneIsAlreadyTakenException if the phone number is already in use.
   */
  createUser(userCreateDto: UserCreateDto, registeredById?: UUID) {
    return this.commandBus.execute(
      new CreateUserCommand(userCreateDto, registeredById),
    );
  }

  /**
   * Update an existing user by dispatching the UpdateUserCommand.
   * @param userId - UUID of the user to be updated.
   * @param userUpdateDto - Data Transfer Object containing user update details.
   * @returns A Promise that resolves to the updated UserDto.
   * @throws UserNotFoundException if the user with the given ID does not exist.
   * @throws PhoneIsAlreadyTakenException if the new phone number is already in use by another user.
   */
  updateUser(userId: UUID, userUpdateDto: UserUpdateDto) {
    return this.commandBus.execute(
      new UpdateUserCommand(userId, userUpdateDto),
    );
  }

  getPaginatedUsers(paginationParams: PaginationParams<User>) {
    return this.queryBus.execute(new GetPaginatedUsersQuery(paginationParams));
  }

  async getUserById(userId: UUID) {
    const user = await this.queryBus.execute(new GetUserByIdQuery(userId));
    if (!user) throw new UserNotFoundException(userId);
    return user;
  }

  async getUserByPhoneNumber(phoneNumber: string) {
    const user = await this.queryBus.execute(
      new GetUserByPhoneQuery(phoneNumber),
    );
    if (!user) throw new UserByPhoneNotFoundException(phoneNumber);
    return user;
  }
}
