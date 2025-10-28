import { CreatedSession } from '../../domain/types/created-session.type';
import { User } from '../../../users/domain/entities/user.entity';

export abstract class TokenCreator {
  /**
   * Create access and refresh tokens for a user.
   * @param user - The user entity for whom to create tokens.
   * @returns An object containing the created access and refresh tokens along with their expiration times.
   */
  abstract createTokens(user: User): CreatedSession;
}
