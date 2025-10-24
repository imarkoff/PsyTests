import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserModelByPhoneQuery } from '../../users/application/queries/get-user-model-by-phone/get-user-model-by-phone.query';
import { PasswordService } from '../../core/auth/password/password.interface';
import { User } from '../../users/domain/entities/user.entity';
import { InvalidLoginDetailsException } from '../domain/exceptions/invalid-login-details.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly passwordService: PasswordService,
  ) {}

  /**
   * Validate user credentials.
   * @param phoneNumber - The phone number of the user.
   * @param password - The password of the user.
   * @returns A promise that resolves to the user entity if credentials are valid.
   * @throws InvalidLoginDetailsException if the credentials are invalid.
   */
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
