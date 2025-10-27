import { AuthValidator } from './auth-validator.interface';
import { Injectable } from '@nestjs/common';
import { User } from '../../../users/domain/entities/user.entity';
import { GetUserModelByPhoneQuery } from '../../../users/application/queries/get-user-model-by-phone/get-user-model-by-phone.query';
import { InvalidLoginDetailsException } from '../../domain/exceptions/invalid-login-details.exception';
import { QueryBus } from '@nestjs/cqrs';
import { PasswordService } from '../../../core/auth/password/password.interface';

@Injectable()
export class AuthValidatorImpl implements AuthValidator {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly passwordService: PasswordService,
  ) {}

  async validateUser(phoneNumber: string, password: string): Promise<User> {
    const user = await this.queryBus.execute(
      new GetUserModelByPhoneQuery(phoneNumber),
    );

    if (!user) throw new InvalidLoginDetailsException();

    const result = await this.passwordService.verifyPassword(password, {
      hash: user.password,
      salt: user.passwordSalt,
    });

    if (!result) throw new InvalidLoginDetailsException();

    return user;
  }
}
