import { User } from '../../../users/domain/entities/user.entity';
import { CreatedSession } from '../../domain/types/created-session.type';

export abstract class SessionCreator {
  /**
   * Creates a session for the given user.
   * @param user The user for whom to create the session.
   * @returns A promise that resolves to the created session containing access and refresh tokens.
   * @throws UserNotFoundException if the user with the given ID does not exist.
   */
  abstract createSession(user: User): Promise<CreatedSession>;
}
