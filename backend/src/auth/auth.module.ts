import { Module } from '@nestjs/common';
import { AuthService } from './application/auth.service';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
