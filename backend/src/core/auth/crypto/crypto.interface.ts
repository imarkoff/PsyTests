export abstract class CryptoService {
  /**
   * Generates cryptographically secure random bytes.
   * @param length - The number of random bytes to generate.
   * @returns A Buffer containing the generated random bytes.
   */
  abstract randomBytes(length: number): Buffer;

  /**
   * Derives a key from a password using the scrypt key derivation function.
   * @param password - The password to derive the key from.
   * @param salt - A salt value to use in the key derivation.
   * @param keylen - The desired length of the derived key.
   * @returns A Promise that resolves to a Buffer containing the derived key.
   */
  abstract scrypt(
    password: string,
    salt: Buffer,
    keylen: number,
  ): Promise<Buffer>;

  /**
   * Compares two Buffers in a way that is resistant to timing attacks.
   * @param a - The first Buffer to compare.
   * @param b - The second Buffer to compare.
   * @returns True if the Buffers are equal, false otherwise.
   */
  abstract timingSafeEqual(a: Buffer, b: Buffer): boolean;
}
