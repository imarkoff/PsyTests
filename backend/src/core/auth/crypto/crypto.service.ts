import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { CryptoService } from './crypto.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NodeCryptoService implements CryptoService {
  randomBytes(length: number): Buffer {
    return randomBytes(length);
  }

  async scrypt(
    password: string,
    salt: Buffer,
    keylen: number,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      scrypt(password, salt, keylen, (err, derivedKey) => {
        if (err) reject(err);
        else resolve(derivedKey);
      });
    });
  }

  timingSafeEqual(a: Buffer, b: Buffer): boolean {
    if (a.length !== b.length) {
      return false;
    }
    return timingSafeEqual(a, b);
  }
}
