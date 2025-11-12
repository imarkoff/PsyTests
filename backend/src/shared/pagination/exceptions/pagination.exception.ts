import { BadRequestException } from '@nestjs/common';

export class PaginationException extends BadRequestException {
  constructor(public message: string) {
    super(message);
  }
}
