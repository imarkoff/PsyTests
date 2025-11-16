import { UserCreateDto } from '../../../presentation/dtos/user-create.dto';
import { UserDto } from '../../../presentation/dtos/user.dto';

export abstract class FirstAdminCreator {
  /**
   * Creates the first admin user if none exists in the system.
   * @param userCreateDto The data for creating the admin user.
   * @returns The created admin user.
   * @throws {AdminAlreadyExistsException} If an admin user already exists.
   */
  abstract createFirstAdminIfNotExists(
    userCreateDto: UserCreateDto,
  ): Promise<UserDto>;
}
