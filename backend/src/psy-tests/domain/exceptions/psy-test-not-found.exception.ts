import { NotFoundException } from '@nestjs/common';

export class PsyTestNotFoundException extends NotFoundException {
  constructor(testId: string) {
    super(`Psychological test with ID ${testId} not found.`);
  }
}
