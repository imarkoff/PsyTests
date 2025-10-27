import { Module } from '@nestjs/common';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './presentation/auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CoreAuthModule } from '../core/auth/core-auth.module';
import { AuthValidator } from './application/auth-validator/auth-validator.interface';
import { AuthValidatorImpl } from './application/auth-validator/auth-validator.service';

@Module({
  imports: [CqrsModule, CoreAuthModule],
  controllers: [AuthController],
  providers: [
    {
      provide: AuthValidator,
      useClass: AuthValidatorImpl,
    },
    LocalStrategy,
  ],
})
export class AuthModule {}
