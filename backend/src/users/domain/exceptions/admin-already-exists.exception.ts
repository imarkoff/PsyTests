import { ForbiddenException } from '@nestjs/common';

export class AdminAlreadyExistsException extends ForbiddenException {
  constructor() {
    super('An admin user already exists.');
  }
}
