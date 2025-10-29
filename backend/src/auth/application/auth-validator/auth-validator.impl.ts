import { AuthValidator } from './auth-validator.abstract';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '../../../users/domain/entities/user.entity';
import { GetUserModelByPhoneQuery } from '../../../users/application/queries/get-user-model-by-phone/get-user-model-by-phone.query';
import { InvalidLoginDetailsException } from '../../domain/exceptions/invalid-login-details.exception';
import { QueryBus } from '@nestjs/cqrs';
import { PasswordService } from '../../../core/auth/password/password.interface';

@Injectable()
export class AuthValidatorImpl implements AuthValidator {
  private readonly logger = new Logger(AuthValidator.name);

  constructor(
    private readonly queryBus: QueryBus,
    private readonly passwordService: PasswordService,
  ) {}

  async validateUser(phoneNumber: string, password: string): Promise<User> {
    try {
      const user = await this.validateUserWithoutLogging(phoneNumber, password);
      this.logger.debug(`User validated successfully: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.warn(
        `Failed to validate user with phone number: ${phoneNumber}`,
      );
      throw error;
    }
  }

  private async validateUserWithoutLogging(
    phoneNumber: string,
    password: string,
  ): Promise<User> {
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
