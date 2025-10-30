import { User } from '../../../users/domain/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtConfig } from '../../../core/config/jwt.config';
import { TokenPayload } from '../../domain/types/token-payload.type';
import { CreatedSession } from '../../domain/types/created-session.type';
import { Injectable, Logger } from '@nestjs/common';
import { TokenCreator } from './token-creator.abstract';

@Injectable()
export class TokenCreatorImpl implements TokenCreator {
  private readonly logger = new Logger(TokenCreatorImpl.name);
  private readonly jwtConfig: JwtConfig;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtConfig = this.configService.get<JwtConfig>('jwt')!;
  }

  createTokens(user: User): CreatedSession {
    this.logger.debug(`Creating tokens for user with ID: ${user.id}`);

    const payload: TokenPayload = { sub: user.id, role: user.role };
    const accessToken = this.createAccessToken(payload);
    const refreshToken = this.createRefreshToken(payload);

    this.logger.debug(`Creating refresh token for user with ID: ${user.id}`);

    return {
      accessToken: accessToken[0],
      accessTokenExpiresIn: accessToken[1],
      refreshToken: refreshToken[0],
      refreshTokenExpiresIn: refreshToken[1],
    };
  }

  private createAccessToken(payload: TokenPayload): [string, Date] {
    const jwt = this.jwtService.sign(payload, {
      secret: this.jwtConfig.secret,
      expiresIn: `${this.jwtConfig.accessTokenExpiresInMinutes}m`,
    });

    const expirationDate = new Date();
    expirationDate.setMinutes(
      expirationDate.getMinutes() + this.jwtConfig.accessTokenExpiresInMinutes,
    );

    return [jwt, expirationDate];
  }

  private createRefreshToken(payload: TokenPayload): [string, Date] {
    const jwt = this.jwtService.sign(payload, {
      secret: this.jwtConfig.secret,
      expiresIn: `${this.jwtConfig.refreshTokenExpiresInDays}d`,
    });

    const expirationDate = new Date();
    expirationDate.setDate(
      expirationDate.getDate() + this.jwtConfig.refreshTokenExpiresInDays,
    );

    return [jwt, expirationDate];
  }
}
