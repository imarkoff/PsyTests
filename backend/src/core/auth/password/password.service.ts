import { CryptoService } from '../crypto/crypto.interface';
import { HashedPassword } from './types/hashed-password.type';
import { Injectable } from '@nestjs/common';
import { PasswordService } from './password.interface';

@Injectable()
export class PasswordServiceImpl implements PasswordService {
  constructor(private readonly crypto: CryptoService) {}

  async hashPassword(password: string): Promise<HashedPassword> {
    const salt = this.crypto.randomBytes(16);
    const hash = await this.crypto.scrypt(password, salt, 64);
    return { salt, hash };
  }

  async verifyPassword(
    password: string,
    hashedPassword: HashedPassword,
  ): Promise<boolean> {
    const saltBuffer = Buffer.from(hashedPassword.salt);
    const storedHashBuffer = Buffer.from(hashedPassword.hash);

    const hash = await this.crypto.scrypt(password, saltBuffer, 64);
    return this.crypto.timingSafeEqual(hash, storedHashBuffer);
  }
}
