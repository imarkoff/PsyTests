import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../../domain/types/token-payload.type';
import { User } from '../../../users/domain/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { PayloadValidator } from '../../application/payload-validator/payload-validator.abstract';
import { JwtConfigGetter } from '../../../core/config/configs/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configGetter: JwtConfigGetter,
    private readonly payloadValidator: PayloadValidator,
  ) {
    const jwtConfig = configGetter.get();

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
