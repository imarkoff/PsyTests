import { AssignedTest } from '../../domain/entities/assigned-test.entity';
import { randomUUID } from 'node:crypto';

export const createAssignedTestFixture = (
  overrides?: Partial<AssignedTest>,
): AssignedTest => {
  const persistence: Partial<AssignedTest> = {
    id: randomUUID(),
    testId: randomUUID(),
    assignedToPatientId: randomUUID(),
    assignedByDoctorId: randomUUID(),
    assignedAt: new Date(),
    unassignedAt: null,
    ...overrides,
  };

  const assignedTest = new AssignedTest();
  Object.assign(assignedTest, persistence);
  return assignedTest;
};
