import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from '../../users/domain/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { AuthValidator } from '../application/auth-validator/auth-validator.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authValidator: AuthValidator) {
    super({
      usernameField: 'phoneNumber',
      passwordField: 'password',
    });
  }

  async validate(phoneNumber: string, password: string): Promise<User> {
    return this.authValidator.validateUser(phoneNumber, password);
  }
}
