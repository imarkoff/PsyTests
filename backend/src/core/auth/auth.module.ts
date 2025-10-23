import { Module } from '@nestjs/common';
import { CryptoService } from './crypto/crypto.interface';
import { NodeCryptoService } from './crypto/crypto.service';
import { PasswordHasher } from './password-hasher/password-hasher.interface';
import { PasswordHasherImpl } from './password-hasher/password-hasher.service';

@Module({
  providers: [
    {
      provide: CryptoService,
      useClass: NodeCryptoService,
    },
    {
      provide: PasswordHasher,
      useClass: PasswordHasherImpl,
    },
  ],
  exports: [PasswordHasher],
})
export class AuthModule {}
