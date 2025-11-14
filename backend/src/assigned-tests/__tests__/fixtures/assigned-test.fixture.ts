import {
  AssignedTest,
  PrismaAssignedTest,
} from '../../domain/entities/assigned-test.entity';
import { randomUUID } from 'node:crypto';

export const createAssignedTestFixture = (
  overrides?: Partial<AssignedTest>,
): AssignedTest => {
  const persistence: PrismaAssignedTest = {
    id: randomUUID(),
    testId: randomUUID(),
    assignedToPatientId: randomUUID(),
    assignedByDoctorId: randomUUID(),
    assignedAt: new Date(),
    unassignedAt: null,
    ...overrides,
  };

  return AssignedTest.fromPersistence(persistence);
};
