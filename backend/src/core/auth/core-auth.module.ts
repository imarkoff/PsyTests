import { Module } from '@nestjs/common';
import { CryptoService } from './crypto/crypto.interface';
import { NodeCryptoService } from './crypto/crypto.service';
import { PasswordService } from './password/password.interface';
import { PasswordServiceImpl } from './password/password.service';

@Module({
  providers: [
    {
      provide: CryptoService,
      useClass: NodeCryptoService,
    },
    {
      provide: PasswordService,
      useClass: PasswordServiceImpl,
    },
  ],
  exports: [PasswordService],
})
export class CoreAuthModule {}
