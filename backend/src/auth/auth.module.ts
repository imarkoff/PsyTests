import { Module } from '@nestjs/common';
import { LocalStrategy } from './infrastructure/strategies/local.strategy';
import { AuthController } from './presentation/auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CoreAuthModule } from '../core/auth/core-auth.module';
import { AuthValidator } from './application/auth-validator/auth-validator.abstract';
import { AuthValidatorImpl } from './application/auth-validator/auth-validator.impl';
import { SessionCreator } from './application/session-creator/session-creator.abstract';
import { SessionCreatorImpl } from './application/session-creator/session-creator.impl';
import { SetRefreshTokenInterceptor } from './infrastructure/interceptors/set-refresh-token.interceptor';
import { PayloadValidator } from './application/payload-validator/payload-validator.abstract';
import { PayloadValidatorImpl } from './application/payload-validator/payload-validator.impl';
import { RefreshTokenCookieSetter } from './application/refresh-token-cookie-setter/refresh-token-cookie-setter.abstract';
import { RefreshTokenCookieSetterImpl } from './application/refresh-token-cookie-setter/refresh-token-cookie-setter.impl';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { TokenCreator } from './application/token-creator/token-creator.abstract';
import { TokenCreatorImpl } from './application/token-creator/token-creator.impl';

@Module({
  imports: [CqrsModule, CoreAuthModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    {
      provide: AuthValidator,
      useClass: AuthValidatorImpl,
    },
    {
      provide: PayloadValidator,
      useClass: PayloadValidatorImpl,
    },
    {
      provide: RefreshTokenCookieSetter,
      useClass: RefreshTokenCookieSetterImpl,
    },
    {
      provide: SessionCreator,
      useClass: SessionCreatorImpl,
    },
    {
      provide: TokenCreator,
      useClass: TokenCreatorImpl,
    },
    SetRefreshTokenInterceptor,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
