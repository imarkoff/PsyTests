import { NotFoundException } from '@nestjs/common';
import { UUID } from 'node:crypto';

export class AssignedTestByTestIdAndPatientIdNotFoundException extends NotFoundException {
  constructor(testId: UUID, patientId: UUID) {
    super(
      `Assigned test with test ID ${testId} for patient ID ${patientId} not found.`,
    );
  }
}
