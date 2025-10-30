import { PayloadValidator } from './payload-validator.abstract';
import { Injectable, Logger } from '@nestjs/common';
import { TokenPayload } from '../../domain/types/token-payload.type';
import { QueryBus } from '@nestjs/cqrs';
import { User } from '../../../users/domain/entities/user.entity';
import { GetUserModelByIdQuery } from '../../../users/application/queries/get-user-model-by-id/get-user-model-by-id.query';
import { UserFromJwtNotFoundException } from '../../domain/exceptions/user-from-jwt-not-found.exception';

@Injectable()
export class PayloadValidatorImpl implements PayloadValidator {
  private readonly logger = new Logger(PayloadValidator.name);

  constructor(private readonly queryBus: QueryBus) {}

  async validatePayload(payload: TokenPayload): Promise<User> {
    const user = await this.queryBus.execute(
      new GetUserModelByIdQuery(payload.sub),
    );

    if (!user) {
      this.logger.warn(`User not found for ID: ${payload.sub}`);
      throw new UserFromJwtNotFoundException();
    }

    this.logger.debug(`User validated successfully for ID: ${payload.sub}`);

    return user;
  }
}
