import {
  Controller,
  Post,
  UseGuards,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import type { Response } from 'express';
import { LocalAuthGuard } from '../infrastructure/guards/local-auth.guard';
import { User } from '../../users/domain/entities/user.entity';
import { UserFromAuth } from '../../core/decorators/user-from-auth.decorator';
import { SessionCreator } from '../application/session-creator/session-creator.abstract';
import { SetRefreshTokenInterceptor } from '../infrastructure/interceptors/set-refresh-token.interceptor';
import { RefreshTokenCookieSetter } from '../application/refresh-token-cookie-setter/refresh-token-cookie-setter.abstract';
import { RefreshTokenGuard } from '../infrastructure/guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly sessionCreator: SessionCreator,
    private readonly refreshTokenSetter: RefreshTokenCookieSetter,
  ) {}

  @UseGuards(LocalAuthGuard)
  @UseInterceptors(SetRefreshTokenInterceptor)
  @Post('login')
  async login(@UserFromAuth() user: User) {
    return this.sessionCreator.createSession(user);
  }

  @UseGuards(RefreshTokenGuard)
  @UseInterceptors(SetRefreshTokenInterceptor)
  @Post('refresh-token')
  async refreshToken(@UserFromAuth() user: User) {
    return this.sessionCreator.createSession(user);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    this.refreshTokenSetter.clearRefreshTokenCookie(res);
  }
}
