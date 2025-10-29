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
import { Public } from '../../core/decorators/public.decorator';
import { ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { UserLoginDto } from './dtos/user-login.dto';
import { CreatedSessionDto } from './dtos/created-session.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly sessionCreator: SessionCreator,
    private readonly refreshTokenSetter: RefreshTokenCookieSetter,
  ) {}

  /**
   * Log in a user and create a session
   *
   * @remarks
   *  This endpoint authenticates a user using their credentials and,
   *  upon successful authentication, creates a session that includes access and
   *  refresh tokens. The refresh token is set in an HTTP-only cookie.
   *
   * @param user The authenticated user.
   * @returns The created session containing access and refresh tokens.
   * @throws {404} If the user is not found (phone or password is incorrect).
   */
  @ApiBody({ type: UserLoginDto })
  @ApiCreatedResponse({ type: CreatedSessionDto })
  @Public()
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(SetRefreshTokenInterceptor)
  @Post('login')
  async login(@UserFromAuth() user: User) {
    return this.sessionCreator.createSession(user);
  }

  /**
   * Refresh the access token using a valid refresh token
   *
   * @remarks
   * This endpoint allows a user to obtain a new access token by providing a valid
   * refresh token. The refresh token is expected to be sent in an HTTP-only cookie.
   * Upon successful validation of the refresh token, a new session is created,
   * which includes a new access token and a new refresh token. The new refresh token
   * is set in an HTTP-only cookie.
   *
   * @param user The user associated with the valid refresh token.
   * @returns The newly created session containing the new access and refresh tokens.
   * @throws {401} If the refresh token is missing, invalid, or expired.
   */
  @ApiCreatedResponse({ type: CreatedSessionDto })
  @Public()
  @UseGuards(RefreshTokenGuard)
  @UseInterceptors(SetRefreshTokenInterceptor)
  @Post('refresh-token')
  async refreshToken(@UserFromAuth() user: User) {
    return this.sessionCreator.createSession(user);
  }

  /**
   * Log out a user by clearing the refresh token cookie
   *
   * @remarks
   * This endpoint logs out the user by clearing the refresh token cookie from the client's browser.
   * It does not require any authentication and simply removes the cookie to invalidate the session.
   *
   * @param res The HTTP response object used to clear the cookie.
   */
  @ApiCreatedResponse({ description: 'User logged out successfully.' })
  @Public()
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    this.refreshTokenSetter.clearRefreshTokenCookie(res);
  }
}
