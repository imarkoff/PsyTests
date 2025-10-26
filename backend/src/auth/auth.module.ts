import { Module } from '@nestjs/common';
import { AuthService } from './application/auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './presentation/auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CoreAuthModule } from '../core/auth/core-auth.module';

@Module({
  imports: [CqrsModule, CoreAuthModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
