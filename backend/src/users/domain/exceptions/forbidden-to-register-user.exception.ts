import { ForbiddenException } from '@nestjs/common';

export class ForbiddenToRegisterUserException extends ForbiddenException {
  constructor() {
    super('You do not have permission to register a new user.');
  }
}
