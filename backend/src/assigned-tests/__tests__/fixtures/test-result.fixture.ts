import { TestResult } from '../../domain/entities/test-result.entity';
import { randomUUID } from 'node:crypto';

export const createTestResultFixture = (
  overrides?: Partial<TestResult>,
): TestResult => {
  const persistence: TestResult = {
    id: randomUUID(),
    testId: randomUUID(),
    completedByPatient: null,
    completedByPatientId: randomUUID(),
    completedAt: new Date(),
    resultsData: {},
    ...overrides,
  };

  return Object.assign(new TestResult(), persistence);
};
