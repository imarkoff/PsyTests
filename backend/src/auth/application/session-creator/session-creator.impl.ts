import { User } from 'src/users/domain/entities/user.entity';
import { SessionCreator } from './session-creator.abstract';
import { CreatedSession } from '../../domain/types/created-session.type';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateLastLoginCommand } from '../../../users/application/commands/update-last-login/update-last-login.command';
import { TokenCreator } from '../token-creator/token-creator.abstract';

@Injectable()
export class SessionCreatorImpl implements SessionCreator {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly tokenCreator: TokenCreator,
  ) {}

  async createSession(user: User): Promise<CreatedSession> {
    await this.commandBus.execute(new UpdateLastLoginCommand(user.id));
    return this.tokenCreator.createTokens(user);
  }
}
