import { HashedPassword } from './types/hashed-password.type';

export abstract class PasswordService {
  /**
   * Hashes a password and returns the hashed password along with the salt used.
   * @param password - The plain text password to be hashed.
   * @returns A promise that resolves to an object containing the salt and hashed password.
   */
  abstract hashPassword(password: string): Promise<HashedPassword>;

  /**
   * Verifies a plain text password against a hashed password.
   * @param password - The plain text password to verify.
   * @param hashedPassword - The hashed password object containing the salt and hash.
   * @returns A promise that resolves to true if the password matches, false otherwise.
   */
  abstract verifyPassword(
    password: string,
    hashedPassword: HashedPassword,
  ): Promise<boolean>;
}
