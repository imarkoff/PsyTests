import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport';
import { AuthService } from '../application/auth.service';
import { User } from '../../users/domain/entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(phoneNumber: string, password: string): Promise<User> {
    return this.authService.validateUser(phoneNumber, password);
  }
}
