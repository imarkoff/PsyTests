import { User } from '../../../users/domain/entities/user.entity';

/** Class responsible for validating user authentication credentials. */
export abstract class AuthValidator {
  /**
   * Validate user credentials.
   * @param phoneNumber - The phone number of the user.
   * @param password - The password of the user.
   * @returns A promise that resolves to the user entity if credentials are valid.
   * @throws InvalidLoginDetailsException if the credentials (phone number or password) are invalid.
   */
  abstract validateUser(phoneNumber: string, password: string): Promise<User>;
}
