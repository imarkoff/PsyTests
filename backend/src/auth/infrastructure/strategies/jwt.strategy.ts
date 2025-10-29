import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../../domain/types/token-payload.type';
import { User } from '../../../users/domain/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtConfig } from '../../../core/config/jwt.config';
import { PayloadValidator } from '../../application/payload-validator/payload-validator.abstract';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly payloadValidator: PayloadValidator,
  ) {
    const jwtConfig: JwtConfig = configService.get<JwtConfig>('jwt')!;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
    });
  }

  validate(payload: TokenPayload): Promise<User> {
    return this.payloadValidator.validatePayload(payload);
  }
}
