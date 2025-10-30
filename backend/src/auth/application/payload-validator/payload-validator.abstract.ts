import { TokenPayload } from '../../domain/types/token-payload.type';
import { User } from '../../../users/domain/entities/user.entity';

export abstract class PayloadValidator {
  /**
   * Validate the token payload and return the corresponding user.
   * @param payload - The token payload to validate.
   * @returns A promise that resolves to the user entity associated with the payload.
   * @throws UserFromJwtNotFoundException if no user is found for the given payload.
   */
  abstract validatePayload(payload: TokenPayload): Promise<User>;
}
