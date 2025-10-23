import { CryptoService } from '../crypto/crypto.interface';
import { HashedPassword } from './types/hashed-password.type';
import { Injectable } from '@nestjs/common';
import { PasswordHasher } from './password-hasher.interface';

@Injectable()
export class PasswordHasherImpl implements PasswordHasher {
  constructor(private readonly crypto: CryptoService) {}

  async hashPassword(password: string): Promise<HashedPassword> {
    const salt = this.crypto.randomBytes(16);
    const hash = await this.crypto.scrypt(password, salt, 64);
    return { salt, hash };
  }
}
