import { ConflictException } from '@nestjs/common';
import { UUID } from 'node:crypto';

export class AssignedTestNotFoundException extends ConflictException {
  constructor(assignedTestId: UUID);
  constructor(testId: UUID, doctorId: UUID, patientId: UUID);
  constructor(assignedTestIdOrTestId: UUID, doctorId?: UUID, patientId?: UUID) {
    if (doctorId !== undefined && patientId !== undefined) {
      super(
        `Assigned test with Test ID ${assignedTestIdOrTestId}, Doctor ID ${doctorId}, and Patient ID ${patientId} not found.`,
      );
    } else {
      super(`Assigned test with ID ${assignedTestIdOrTestId} not found.`);
    }
  }
}
