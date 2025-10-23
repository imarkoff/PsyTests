import { PaginationParams } from '../../../shared/pagination/types/pagination-params.type';
import { User } from '../entities/user.entity';
import { UserRole } from '../../../shared/enums/user-role.enum';
import { PaginatedList } from '../../../shared/pagination/types/paginated-list.type';
import { UUID } from 'crypto';

export abstract class UserRepository {
  /**
   * Get a paginated list of users.
   * @param params - Pagination parameters.
   * @returns A promise that resolves to a paginated list of users.
   */
  abstract getUsers(
    params: PaginationParams<User>,
  ): Promise<PaginatedList<User>>;

  /**
   * Get a paginated list of users by role.
   * @param role - The role of the users to retrieve.
   * @param params - Pagination parameters.
   * @returns A promise that resolves to a paginated list of users with the specified role.
   */
  abstract getUsersByRole(
    role: UserRole,
    params: PaginationParams<User>,
  ): Promise<PaginationParams<User>>;

  /**
   * Get a user by their unique identifier.
   * @param id - The unique identifier of the user.
   * @returns A promise that resolves to the user if found, or null if not found.
   */
  abstract getUserById(id: UUID): Promise<User | null>;

  /**
   * Get a user by their phone number.
   * @param phone - The phone number of the user.
   * @returns A promise that resolves to the user if found, or null if not found.
   */
  abstract getUserByPhone(phone: string): Promise<User | null>;

  /**
   * Create a new user.
   * @param data - The data of the user to create.
   * @returns A promise that resolves to the created user.
   * @throws PhoneIsAlreadyTakenException if the phone number is already in use.
   */
  abstract createUser(data: User): Promise<User>;

  /**
   * Update an existing user.
   * @param updatedUser - The user entity with updated data.
   * @returns A promise that resolves to the updated user.
   */
  abstract updateUser(updatedUser: User): Promise<User>;

  /**
   * Delete a user by their unique identifier.
   * @param id - The unique identifier of the user to delete.
   * @returns A promise that resolves when the user is deleted.
   */
  abstract deleteUser(id: UUID): Promise<void>;
}
