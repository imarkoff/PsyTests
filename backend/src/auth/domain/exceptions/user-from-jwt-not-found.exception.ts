import { UnauthorizedException } from '@nestjs/common';

export class UserFromJwtNotFoundException extends UnauthorizedException {
  constructor() {
    super('User from JWT token not found (possibly deleted)');
  }
}
