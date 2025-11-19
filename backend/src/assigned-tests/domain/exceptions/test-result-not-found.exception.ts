import { NotFoundException } from '@nestjs/common';
import { UUID } from 'node:crypto';

export class TestResultNotFoundException extends NotFoundException {
  constructor(testResultId: UUID) {
    super(`Test result with ID ${testResultId} not found.`);
  }
}
