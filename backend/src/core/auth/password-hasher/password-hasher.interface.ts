import { HashedPassword } from './types/hashed-password.type';

export abstract class PasswordHasher {
  /**
   * Hashes a password and returns the hashed password along with the salt used.
   * @param password - The plain text password to be hashed.
   * @returns A promise that resolves to an object containing the salt and hashed password.
   */
  abstract hashPassword(password: string): Promise<HashedPassword>;
}
