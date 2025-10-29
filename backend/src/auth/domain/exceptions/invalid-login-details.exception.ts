import { BadRequestException } from '@nestjs/common';

export class InvalidLoginDetailsException extends BadRequestException {
  constructor() {
    super('Phone number or password is incorrect.');
  }
}
