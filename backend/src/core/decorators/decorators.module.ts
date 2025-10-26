import { Global, Module } from '@nestjs/common';
import { PasswordConstraint } from './is-password-valid.decorator';

@Global()
@Module({
  providers: [PasswordConstraint],
  exports: [PasswordConstraint],
})
export class DecoratorsModule {}
