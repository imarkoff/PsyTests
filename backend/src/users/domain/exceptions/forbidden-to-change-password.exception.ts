import { ForbiddenException } from '@nestjs/common';

export class ForbiddenToChangePasswordException extends ForbiddenException {
  constructor(message?: string) {
    super(
      message || "You do not have permission to change this user's password.",
    );
  }
}
