import { UnauthorizedException } from '@nestjs/common';

export class InvalidJwtTokenException extends UnauthorizedException {
  constructor() {
    super('The provided JWT token is invalid or has expired.');
  }
}
