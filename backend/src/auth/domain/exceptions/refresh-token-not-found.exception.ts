import { UnauthorizedException } from '@nestjs/common';

export class RefreshTokenNotFoundException extends UnauthorizedException {
  constructor() {
    super('Refresh token not found');
  }
}
