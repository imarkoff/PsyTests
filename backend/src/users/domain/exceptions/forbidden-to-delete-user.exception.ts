import { ForbiddenException } from '@nestjs/common';

export class ForbiddenToDeleteUserException extends ForbiddenException {
  constructor() {
    super("You don't have permission to delete this user.");
  }
}
