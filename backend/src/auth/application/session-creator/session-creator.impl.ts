import { User } from '../../../users/domain/entities/user.entity';
import { SessionCreator } from './session-creator.abstract';
import { CreatedSession } from '../../domain/types/created-session.type';
import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateLastLoginCommand } from '../../../users/application/commands/update-last-login/update-last-login.command';
import { TokenCreator } from '../token-creator/token-creator.abstract';

@Injectable()
export class SessionCreatorImpl implements SessionCreator {
  private readonly logger = new Logger(SessionCreatorImpl.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly tokenCreator: TokenCreator,
  ) {}

  async createSession(user: User): Promise<CreatedSession> {
    this.logger.debug(`Creating session for user with ID: ${user.id}`);

    await this.commandBus.execute(new UpdateLastLoginCommand(user.id));

    const newTokens = this.tokenCreator.createTokens(user);

    this.logger.debug(`Session created for user with ID: ${user.id}`);

    return newTokens;
  }
}
