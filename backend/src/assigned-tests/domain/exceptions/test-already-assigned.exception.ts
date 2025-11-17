import { ConflictException } from '@nestjs/common';
import { UUID } from 'node:crypto';

export class TestAlreadyAssignedException extends ConflictException {
  constructor(testId: UUID, patientId: UUID) {
    super(
      `Test with ID ${testId} is already assigned to patient with ID ${patientId}.`,
    );
  }
}
